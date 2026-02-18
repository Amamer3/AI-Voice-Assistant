import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@neondatabase/serverless'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Missing knowledge item ID' },
        { status: 400 }
      )
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    })
    await client.connect()

    try {
      await client.query(
        'DELETE FROM knowledge_items WHERE id = $1',
        [id]
      )

      return NextResponse.json({ success: true })
    } finally {
      await client.end()
    }
  } catch (error) {
    console.error('Error deleting knowledge item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
