// app/api/voice/route.js
import { CartesiaClient } from "@cartesia/cartesia-js";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const cartesia = new CartesiaClient({
            apiKey: process.env.CARTESIA_API_KEY, // Accessing the API key from .env.local
        });

        // A simple voice ID. Find more on Cartesia's documentation.
        // This example uses a pre-existing voice.
        const voiceId = "a0e99841-5362-4b8a-8534-586b25e79916"; 

        const audio = await cartesia.tts.create({
            model_id: "sonic-english",
            transcript: text,
            voice_id: voiceId,
        });

// Send the audio data back to the client
        return new NextResponse(audio.body, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });

    } catch (error) {
        console.error("Cartesia API Error:", error);
        return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
    }
}