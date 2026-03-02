import { NextResponse } from 'next/server'
import { getMessageData } from '@/services/api/admin/getmessagedata'

export async function GET() {
  try {
    const data = await getMessageData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
