// app/api/lsp/completions/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('[LSP] completion request:', body);

  // ── STUB: confirm pipe is working ──
  return NextResponse.json({
    completions: [
      { label: 'useState',   kind: 'Function', detail: 'React hook', insertText: 'useState' },
      { label: 'useEffect',  kind: 'Function', detail: 'React hook', insertText: 'useEffect' },
      { label: 'useCallback',kind: 'Function', detail: 'React hook', insertText: 'useCallback' },
    ]
  });
}