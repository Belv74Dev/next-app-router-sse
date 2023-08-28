import { NextResponse } from "next/server"
import { EventEmitter } from 'node:events'

const emitter = new EventEmitter()

export async function GET() {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  emitter.on('newMessage', (message) => {
    writer.write(`data: ${JSON.stringify(message)} \n\n`)
  })

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  })
}

export async function POST(req) {
  const message = await req.json()
  emitter.emit('newMessage', message)
  return NextResponse.json({})
}
