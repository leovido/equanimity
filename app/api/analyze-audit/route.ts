import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { 
          error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env.local file." 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { badHabitsChecked, improvements, reflection, mode } = body;

    if (!badHabitsChecked && !improvements && !reflection) {
      return NextResponse.json(
        { error: "At least one input field is required" },
        { status: 400 }
      );
    }

    const contextMode = mode === "work" ? "work/professional" : "personal life";

    const prompt = `You are analyzing a nightly audit reflection from a stoic practice app. The user has provided three inputs about their day:

1. Bad habits checked: "${badHabitsChecked || "Not provided"}"
2. Improvements: "${improvements || "Not provided"}"
3. General reflection: "${reflection || "Not provided"}"

Context mode: ${contextMode}

Your task:
1. Generate 3-5 dynamic category labels that best describe the themes in this reflection. Categories should be specific and actionable (e.g., "sleep", "listening - personal", "work productivity", "exercise", "mindfulness"). Consider the context mode when categorizing.

2. Analyze the overall sentiment of the reflection. Provide:
   - A sentiment score from 0-100 (where 0 is very negative, 50 is neutral, 100 is very positive)
   - A sentiment label: "Positive", "Neutral", or "Negative"
   - A brief explanation (2-3 sentences) of why this sentiment was determined

Return your response as a JSON object with this exact structure:
{
  "categories": ["category1", "category2", "category3"],
  "sentiment": {
    "score": 75,
    "label": "Positive",
    "explanation": "Your explanation here"
  }
}

Only return the JSON object, no additional text.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    const fullResponse = result.text;
    
    // Try to extract JSON from the response
    let jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, try to parse the whole response
      jsonMatch = [fullResponse];
    }

    let analysis: {
      categories: string[];
      sentiment: { score: number; label: string; explanation: string };
    };
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch {
      // If parsing fails, return a structured error response
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          rawResponse: fullResponse,
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!analysis.categories || !Array.isArray(analysis.categories)) {
      return NextResponse.json(
        { error: "Invalid response format: categories missing" },
        { status: 500 }
      );
    }

    if (!analysis.sentiment || typeof analysis.sentiment.score !== "number") {
      return NextResponse.json(
        { error: "Invalid response format: sentiment missing" },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing audit:", error);
    
    // Provide more detailed error information
    let errorMessage = "Failed to analyze reflection";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for common OpenAI API errors
      const errorLower = error.message.toLowerCase();
      if (errorLower.includes("api key") || errorLower.includes("invalid")) {
        errorMessage = "Invalid OpenAI API key. Please check your .env.local file.";
      } else if (errorLower.includes("rate limit") || errorLower.includes("rate_limit")) {
        errorMessage = "Rate limit exceeded. Please try again in a moment.";
      } else if (errorLower.includes("quota") || errorLower.includes("insufficient_quota") || errorLower.includes("exceeded your current quota")) {
        errorMessage = "OpenAI API quota exceeded. Please check your billing and plan details at https://platform.openai.com/account/billing";
      } else if (errorLower.includes("billing")) {
        errorMessage = "OpenAI billing issue. Please check your account billing details.";
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

