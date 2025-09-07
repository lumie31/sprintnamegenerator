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

        const prompt = `Generate exactly 3 different creative sprint names for Sprint ${sprintNum}.
        Constraints for each name:
        - 2 to 4 words
        - Creative and fun
        - If possible, relate to the number ${sprintNum} (e.g., "Sweet Sixteen" for 16)
        - Use wordplay or puns when natural
        - Suitable for a professional but fun work environment
        - Output ONLY the names, each on its own line
        - No numbering, no bullets, no quotes, no trailing punctuation`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a concise creative assistant. Return exactly three sprint names, one per line, no numbering, no bullets, no quotes, no trailing punctuation.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 100,
          temperature: 0.9,
        });

        const text = completion.choices[0]?.message?.content || '';
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => l.replace(/^[-•\d\.\)\s]+/, '')) // remove bullets/numbering if any
          .map((l) => l.replace(/^["']|["']$/g, '')) // strip surrounding quotes
          .map((l) => l.replace(/[\s\t]+/g, ' ').trim());

        // Keep 2-4 words, 2-30 chars, unique, up to 3
        const unique: string[] = [];
        for (const name of lines) {
          const wordCount = name.split(' ').filter(Boolean).length;
          if (
            wordCount >= 2 &&
            wordCount <= 4 &&
            name.length >= 2 &&
            name.length <= 30 &&
            !unique.includes(name)
          ) {
            unique.push(name);
          }
          if (unique.length === 3) break;
        }

        if (unique.length > 0) {
          return NextResponse.json({
            sprintNames: unique,
            sprintNumber: sprintNum,
            source: 'ai',
          });
        }
      } catch {
        // OpenAI generation failed, using fallback
      }
    }

    // Use fallback system for creative names (3 options)
    const generatedNames = generateFallbackNames(sprintNum);

    return NextResponse.json({
      sprintNames: generatedNames,
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

function generateFallbackNames(sprintNumber: number): string[] {
  const number = Number(sprintNumber);

  // Pre-defined patterns for common numbers
  const patterns: { [key: number]: string[] } = {
    1: ['First Steps', 'Genesis Run', 'Project Kickoff'],
    2: ['Double Trouble', 'Dynamic Duo', 'Twofold Triumph'],
    3: ["Three's Company", 'Triple Threat', 'Tri-Force'],
    4: ['Four Score', 'Fantastic Four', 'Quad Quest'],
    5: ['High Five', 'Fab Five', 'Five Alive'],
    6: ['Sixth Sense', 'Super Six', 'Six Spark'],
    7: ['Lucky Seven', 'Seven Surge', 'Seventh Heaven'],
    8: ['Eight is Great', 'Great Eight', 'Octo Momentum'],
    9: ['Cloud Nine', 'Nine to Shine', 'Nine Lives'],
    10: ['Perfect Ten', 'Top Ten', 'Tenfold Momentum'],
    11: ['Eleventh Hour', 'Elevensies', 'Prime Eleven'],
    12: ['Midnight Train', 'Dozen Dash', 'Twelve Thrive'],
    13: ['Unlucky Thirteen', "Baker's Dozen", 'Lucky Thirteen'],
    14: ['Spr1nt 4ever', 'Fourteen Karat', 'Fourteen Flow'],
    15: ['Fifteen Minutes', 'Fifteen Flames', 'Fifteen Focus'],
    16: ['Sweet Sixteen', 'Sixteen Candles', 'Sixteen Sprint'],
    17: ['Seventeen Candles', 'Seventeen Surge', 'Prime Seventeen'],
    18: ['Eighteen Wheels', 'Eighteen Engine', 'Eighteen Edge'],
    19: ['Nineteen Eighty-Four', 'Nineteen Nexus', 'Nineteen Rise'],
    20: ['Twenty-Twenty Vision', 'Perfect Vision', 'Twenty Tempo'],
    21: ['Twenty-One Questions', 'Blackjack Run', 'Twenty-One Turbo'],
    22: ['Double Deuce', 'Twenty-Two Jump', '22 Accel'],
    23: ["Jordan's Number", 'Twenty-Three Lift', '23 Velocity'],
    24: ['Twenty-Four Hours', 'Round-the-Clock', '24/7 Drive'],
    25: ['Quarter Century', 'Silver Sprint', 'Twenty-Five Thrive'],
    30: ['Thirty Something', 'Dirty Thirty', 'Thirty Throttle'],
    40: ['Forty Winks', 'Forty and Forward', 'Forty Flow'],
    50: ['Fifty Shades', 'Fifty Forward', 'Halfway Hero'],
    60: ['Sixty Minutes', 'Sixty Shift', 'Sixty Spark'],
    70: ['Seventy Times Seven', 'Seventy Surge', 'Seventy Sprint'],
    80: ['Eighty Days', 'Eighty Elevate', 'Eighty Engine'],
    90: ['Ninety-Nine Problems', 'Ninety Nine Rise', 'Ninety Nexus'],
    100: ['Century Mark', 'Centennial Sprint', 'Century Surge'],
  };

  if (patterns[number]) {
    return patterns[number];
  }

  // Fallback generic constructions
  const base = [`${number} Momentum`, `${number} Surge`, `${number} Quest`];
  return base;
}
