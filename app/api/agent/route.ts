import { openai } from "@ai-sdk/openai";
import type { CoreMessage } from "ai";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: CoreMessage[] = body.messages;

    const result = await streamText({
      system: "You are a helpful assistant",
      model: openai("gpt-3.5-turbo"),
      messages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.textStream) {
          controller.enqueue(new TextEncoder().encode(chunk));
          console.log("🧩 Chunk enviado:", chunk);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("💥 Error en /api/agent:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
