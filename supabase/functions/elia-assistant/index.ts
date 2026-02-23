const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_QUESTION_LENGTH = 2000;

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  // Modo beta: aceita requests sem exigir sessão de usuário.
  // Quando o fluxo estiver estável, reativar validação rígida de auth.

  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) {
    return jsonResponse(
      { error: "GEMINI_API_KEY is not configured in Supabase secrets." },
      500,
    );
  }

  let payload: { question?: unknown } = {};
  try {
    payload = (await request.json()) as { question?: unknown };
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const question =
    typeof payload.question === "string" ? payload.question.trim() : "";

  if (!question) {
    return jsonResponse({ error: "Question is required." }, 400);
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return jsonResponse(
      {
        error: `Question is too long. Max allowed: ${MAX_QUESTION_LENGTH} characters.`,
      },
      400,
    );
  }

  const model = Deno.env.get("GEMINI_MODEL") || DEFAULT_MODEL;

  const systemPrompt = `Você é a assistente "elia (beta)" do Dockfy, uma plataforma de gestão de contratos imobiliários.
Objetivo:
- Responder dúvidas contratuais e operacionais de corretores/imobiliárias com linguagem clara.
- Priorizar resposta prática, em tópicos curtos e acionáveis.
Restrições:
- Não inventar fatos.
- Não se apresentar como advogado nem dar garantia jurídica absoluta.
- Quando o tema for sensível, orientar validação com jurídico humano.`;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": geminiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: question }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 700,
        },
      }),
    },
  );

  if (!geminiResponse.ok) {
    const text = await geminiResponse.text();
    return jsonResponse(
      {
        error: "Gemini request failed.",
        details: text,
      },
      502,
    );
  }

  const data = (await geminiResponse.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
    promptFeedback?: {
      blockReason?: string;
      blockReasonMessage?: string;
    };
  };

  const firstCandidate = data.candidates?.[0];
  const parts = firstCandidate?.content?.parts ?? [];
  const answer = parts
    .map((part) => part.text?.trim() || "")
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!answer) {
    const blockedReason = data.promptFeedback?.blockReason;
    return jsonResponse(
      {
        error: "Empty response returned by model.",
        ...(blockedReason ? { blockedReason } : {}),
      },
      502,
    );
  }

  return jsonResponse({
    answer,
    model,
    provider: "gemini",
  });
});
