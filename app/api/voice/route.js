// app/api/voice/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Use direct API call - most reliable approach
        const response = await fetch('https://api.cartesia.ai/tts/bytes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CARTESIA_API_KEY}`,
                'Content-Type': 'application/json',
                'Cartesia-Version': '2024-06-10',
            },
            body: JSON.stringify({
                model_id: "sonic-english",
                transcript: text,
                voice: {
                    mode: "id",
                    id: "a0e99841-438c-4a64-b679-ae501e7d6091", // Updated voice ID from docs
                },
                output_format: {
                    container: "wav",
                    encoding: "pcm_f32le",
                    sample_rate: 44100,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Cartesia API Error Response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/wav',
            },
        });

    } catch (error) {
        console.error("Cartesia API Error:", error);
        return NextResponse.json({ 
            error: "Failed to generate audio", 
            details: error.message 
        }, { status: 500 });
    }
}