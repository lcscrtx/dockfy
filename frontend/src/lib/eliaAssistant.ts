interface EliaAssistantResponse {
  answer?: string;
  response?: string;
  message?: string;
}

const configuredFunctionName =
  import.meta.env.VITE_ELIA_FUNCTION_NAME?.trim() || "smart-service";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const functionCandidates = [configuredFunctionName];

function extractAnswer(payload: unknown): string | null {
  if (typeof payload === "string") {
    const direct = payload.trim();
    return direct || null;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as EliaAssistantResponse;
  const candidate = data.answer ?? data.response ?? data.message;
  if (!candidate || typeof candidate !== "string") {
    return null;
  }

  const answer = candidate.trim();
  return answer || null;
}

export async function askElia(
  question: string,
  accessToken?: string | null,
): Promise<string> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Configuração Supabase ausente no frontend.");
  }

  const hasJwtToken =
    typeof accessToken === "string" &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(accessToken);
  let lastErrorMessage = "Falha ao chamar a assistente.";

  for (const functionName of functionCandidates) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          ...(hasJwtToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastErrorMessage = `Funcao ${functionName} retornou ${response.status}: ${
          errorText || response.statusText
        }`;
        continue;
      }

      const payload = (await response.json()) as unknown;
      const answer = extractAnswer(payload);
      if (answer) {
        return answer;
      }

      lastErrorMessage = `Funcao ${functionName} retornou resposta vazia.`;
    } catch (error) {
      lastErrorMessage =
        error instanceof Error
          ? `Erro de rede ao chamar ${functionName}: ${error.message}`
          : `Erro de rede ao chamar ${functionName}.`;
    }
  }

  throw new Error(lastErrorMessage);
}
