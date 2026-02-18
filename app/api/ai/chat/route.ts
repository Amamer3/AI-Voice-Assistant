import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      system: `You are a helpful AI assistant for a voice productivity platform. 
      You help users with:
      - Recording and transcribing audio
      - Generating content from transcriptions
      - Managing knowledge bases
      - Organizing and analyzing their voice data
      
      Be concise, helpful, and provide actionable suggestions.`,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxOutputTokens: 500,
    })

    return NextResponse.json({
      response: result.text,
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
