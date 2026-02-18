import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@neondatabase/serverless'
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const sessionId = formData.get('sessionId') as string

    if (!file || !sessionId) {
      return NextResponse.json(
        { error: 'Missing file or session ID' },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()
    const preview = fileContent.substring(0, 200) + (fileContent.length > 200 ? '...' : '')

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        id: `dev-${Date.now()}`,
        preview,
        fileName: file.name,
      })
    }

    try {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
      })
      await client.connect()

      try {
        // Create or get knowledge base
        const kbResult = await client.query(
          'SELECT id FROM knowledge_bases WHERE session_id = $1 LIMIT 1',
          [sessionId]
        )

        let kbId: number
        if (kbResult.rows.length === 0) {
          const newKbResult = await client.query(
            'INSERT INTO knowledge_bases (session_id, name, description) VALUES ($1, $2, $3) RETURNING id',
            [sessionId, 'Default Knowledge Base', 'Default knowledge base for this session']
          )
          kbId = newKbResult.rows[0].id
        } else {
          kbId = kbResult.rows[0].id
        }

        // Generate embedding for the document
        const embedding = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: fileContent,
        })

        // Store knowledge item with embedding
        const itemResult = await client.query(
          'INSERT INTO knowledge_items (kb_id, document_text, embedding, file_name) VALUES ($1, $2, $3, $4) RETURNING id',
          [
            kbId,
            fileContent,
            JSON.stringify(embedding.embedding),
            file.name,
          ]
        )

        return NextResponse.json({
          id: itemResult.rows[0].id,
          preview,
          fileName: file.name,
        })
      } finally {
        await client.end()
      }
    } catch (dbError) {
      console.error('Database error in knowledge upload:', dbError)
      return NextResponse.json({
        id: `dev-${Date.now()}`,
        preview,
        fileName: file.name,
      })
    }
  } catch (error) {
    console.error('Error uploading knowledge item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
