import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { texts } = await req.json();

  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      source_lang: 'EN',
      target_lang: 'BN',
    })
  });

  const json = await res.json();
  const translated = json.translations?.map((t: any) => t.text) || texts;
  return NextResponse.json({ translated });
}