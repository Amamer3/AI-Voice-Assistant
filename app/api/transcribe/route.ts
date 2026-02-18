import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const sessionId = formData.get('sessionId') as string

    if (!audioFile || !sessionId) {
      return NextResponse.json(
        { error: 'Missing audio file or session ID' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY for transcription')
      return NextResponse.json(
        { error: 'Transcription is not configured on the server (missing OPENAI_API_KEY).' },
        { status: 500 }
      )
    }

    // Use OpenAI's Whisper API for transcription
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const formData = new FormData()
        formData.append('file', audioFile)
        formData.append('model', 'whisper-1')
        formData.append('language', 'en')
        return formData
      })(),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Whisper API error:', error)
      return NextResponse.json(
        { error: 'Transcription failed' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const transcript = data.text

    // Store transcription in database
    if (process.env.DATABASE_URL) {
      try {
        const { Client } = await import('@neondatabase/serverless')
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
        })
        await client.connect()

        // Insert transcription record
        await client.query(
          'INSERT INTO transcriptions (recording_id, text, language, confidence) VALUES ($1, $2, $3, $4)',
          [1, transcript, 'en', 0.95] // TODO: Link to actual recording
        )

        await client.end()
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue anyway - transcription was successful
      }
    }

    return NextResponse.json({
      transcript,
      language: 'en',
      confidence: 0.95,
    })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
