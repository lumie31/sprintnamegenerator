import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sprintNumber = body?.sprintNumber;

    if (!sprintNumber || isNaN(Number(sprintNumber))) {
      return NextResponse.json(
        { error: 'Valid sprint number is required' },
        { status: 400 }
      );
    }

    const sprintNum = Number(sprintNumber);

    // Try to use OpenAI API for AI-generated names
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      try {
        const openai = new OpenAI({
          apiKey: openaiApiKey,
        });

        const prompt = `Generate a creative and memorable sprint name for Sprint ${sprintNum}. 
        Requirements:
        - 2-4 words maximum
        - Creative and fun
        - Related to the number ${sprintNum} if possible (like "Sweet Sixteen" for Sprint 16)
        - Can use wordplay, puns, or references to the number
        - Should be suitable for a professional but fun work environment
        - Return only the sprint name, nothing else
        - Do not include quotes or punctuation`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a creative sprint naming assistant. Generate fun, memorable sprint names based on sprint numbers. Return only the name without quotes or punctuation.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 20,
          temperature: 0.8,
        });

        const generatedName = completion.choices[0]?.message?.content?.trim();

        // Clean up the generated name (remove quotes if present)
        const cleanName = generatedName?.replace(/^["']|["']$/g, '').trim();

        // If the model generated something useful, use it
        if (cleanName && cleanName.length >= 2 && cleanName.length <= 30) {
          return NextResponse.json({
            sprintName: cleanName,
            sprintNumber: sprintNum,
            source: 'ai',
          });
        }
      } catch (aiError) {
        // OpenAI generation failed, using fallback
      }
    }

    // Use fallback system for creative names
    const generatedName = generateFallbackName(sprintNum);

    return NextResponse.json({
      sprintName: generatedName,
      sprintNumber: sprintNum,
      source: 'fallback',
    });
  } catch (error) {
    console.error('Error generating sprint name:', error);
    return NextResponse.json(
      { error: 'Failed to generate sprint name' },
      { status: 500 }
    );
  }
}

function generateFallbackName(sprintNumber: number): string {
  const number = Number(sprintNumber);

  // Pre-defined patterns for common numbers
  const patterns: { [key: number]: string } = {
    1: 'First Steps',
    2: 'Double Trouble',
    3: "Three's Company",
    4: 'Four Score',
    5: 'High Five',
    6: 'Sixth Sense',
    7: 'Lucky Seven',
    8: 'Eight is Great',
    9: 'Cloud Nine',
    10: 'Perfect Ten',
    11: 'Eleventh Hour',
    12: 'Midnight Train',
    13: 'Unlucky Thirteen',
    14: 'Spr1nt 4ever',
    15: 'Fifteen Minutes',
    16: 'Sweet Sixteen',
    17: 'Seventeen Candles',
    18: 'Eighteen Wheels',
    19: 'Nineteen Eighty-Four',
    20: 'Twenty-Twenty Vision',
    21: 'Twenty-One Questions',
    22: 'Twenty-Two Jump Street',
    23: 'Twenty-Three Skidoo',
    24: 'Twenty-Four Hours',
    25: 'Quarter Century',
    30: 'Thirty Something',
    40: 'Forty Winks',
    50: 'Fifty Shades',
    60: 'Sixty Minutes',
    70: 'Seventy Times Seven',
    80: 'Eighty Days',
    90: 'Ninety-Nine Problems',
    100: 'Century Mark',
  };

  if (patterns[number]) {
    return patterns[number];
  }

  // Generate based on number patterns
  if (number % 10 === 0) {
    return `Sprint ${number}`;
  } else if (number < 20) {
    return `Sprint ${number}`;
  } else {
    // For other numbers, create a simple pattern
    const tens = Math.floor(number / 10);
    const ones = number % 10;

    if (ones === 0) {
      return `Sprint ${number}`;
    } else {
      return `Sprint ${number}`;
    }
  }
}
