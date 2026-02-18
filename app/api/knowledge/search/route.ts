import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@neondatabase/serverless'
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, query } = await request.json()

    if (!sessionId || !query) {
      return NextResponse.json(
        { error: 'Missing sessionId or query' },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        results: [],
        query,
      })
    }

    // Generate embedding for the query
    const queryEmbedding = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: query,
    })

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })
    await client.connect()

    try {
      // Search for similar documents using vector similarity
      const results = await client.query(
        `SELECT 
          ki.id,
          ki.file_name,
          ki.document_text,
          kb.id as kb_id,
          1 - (ki.embedding::vector <-> $1::vector) as similarity
        FROM knowledge_items ki
        JOIN knowledge_bases kb ON ki.kb_id = kb.id
        WHERE kb.session_id = $2
        ORDER BY similarity DESC
        LIMIT 5`,
        [JSON.stringify(queryEmbedding.embedding), sessionId]
      )

      const searchResults = results.rows.map((row: any) => ({
        id: row.id,
        fileName: row.file_name,
        preview: row.document_text.substring(0, 300),
        similarity: Math.max(0, row.similarity || 0),
      }))

      return NextResponse.json({
        results: searchResults,
        query,
      })
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
