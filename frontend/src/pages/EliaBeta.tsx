import { useEffect, useMemo, useRef, useState } from "react";
import { askElia } from "../lib/eliaAssistant";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowUp,
  Copy,
  LoaderCircle,
  Mic,
  Plus,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
  };
}

function getFirstName(email?: string, fullName?: string): string {
  const fromMetadata = fullName?.trim();
  if (fromMetadata) {
    return fromMetadata.split(" ")[0];
  }

  const fromEmail = email?.split("@")[0]?.replace(/[._-]/g, " ").trim();
  if (!fromEmail) {
    return "você";
  }

  return fromEmail.replace(/\b\w/g, (char) => char.toUpperCase()).split(" ")[0];
}

export function EliaBeta() {
  const { session, user } = useAuth();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const metadata = (user?.user_metadata ?? {}) as { full_name?: string };
  const firstName = useMemo(
    () => getFirstName(user?.email, metadata.full_name),
    [metadata.full_name, user?.email],
  );

  const canSend = input.trim().length > 0 && !sending;
  const quickPrompts = [
    "Quais cláusulas mínimas não podem faltar em um contrato de locação residencial?",
    "Como reduzir risco de inadimplência em contratos comerciais?",
    "Monte um checklist de validação antes de assinar com locatário.",
  ];

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function copyMessage(message: ChatMessage) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 1400);
    } catch {
      setCopiedMessageId(null);
    }
  }

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || sending) {
      return;
    }

    setMessages((prev) => [...prev, createMessage("user", trimmed)]);
    setInput("");
    setSending(true);

    try {
      const answer = await askElia(trimmed, session?.access_token ?? null);
      setMessages((prev) => [...prev, createMessage("assistant", answer)]);
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "Falha ao gerar resposta no momento.";

      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `Não consegui responder agora (${description}). Assim que a função estiver configurada no Supabase, volto a responder normalmente.`,
        ),
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-shell h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
      <div className="mx-auto w-full max-w-[1040px] h-full">
        <div className="h-full overflow-y-auto pt-4 sm:pt-6 pb-44 sm:pb-48">
          {messages.length === 0 ? (
            <div className="pt-12 sm:pt-16">
              <span className="pill-soft bg-blue-50 text-blue-700 border-blue-100">
                <Sparkles size={13} className="mr-1.5" />
                elia (beta)
              </span>
              <h1 className="mt-5 text-[44px] leading-[1.05] tracking-[-0.03em] font-semibold text-text-primary max-w-[760px]">
                Fala, {firstName}. Como posso te ajudar hoje?
              </h1>
              <p className="mt-3 text-[17px] text-text-secondary max-w-[700px]">
                Dúvidas contratuais, revisão de cláusulas e boas práticas comerciais para
                operação imobiliária.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 max-w-[880px]">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="btn-chip h-auto py-2.5 px-3.5 text-[13px] text-left leading-5 bg-white"
                    onClick={() => void submitQuestion(prompt)}
                    disabled={sending}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  {message.role === "user" ? (
                    <div className="max-w-[86%] sm:max-w-[72%] rounded-[18px] rounded-tr-[8px] border border-blue-600 bg-blue-600 px-4 py-3 text-[15px] leading-7 text-white">
                      {message.content}
                    </div>
                  ) : (
                    <div className="max-w-[88%] sm:max-w-[78%]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 inline-flex items-center justify-center">
                          <Sparkles size={13} />
                        </span>
                        <span className="text-[12px] font-semibold text-text-tertiary uppercase tracking-[0.12em]">
                          elia
                        </span>
                      </div>
                      <div className="rounded-[18px] rounded-tl-[8px] border border-base bg-white px-4 py-3.5 text-[15px] leading-7 text-text-primary whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          onClick={() => void copyMessage(message)}
                          className="btn-icon w-8 h-8"
                          title="Copiar resposta"
                        >
                          <Copy size={14} />
                        </button>
                        <button className="btn-icon w-8 h-8" title="Resposta útil">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="btn-icon w-8 h-8" title="Resposta não útil">
                          <ThumbsDown size={14} />
                        </button>
                        {copiedMessageId === message.id && (
                          <span className="text-[12px] text-text-tertiary ml-1">Copiado</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>
      </div>

      <div className="fixed left-0 right-0 lg:left-[260px] bottom-0 z-40 px-4 sm:px-6 lg:px-7">
        <div className="w-full bg-gradient-to-t from-[var(--color-canvas)] via-[var(--color-canvas)]/98 to-transparent pt-3 pb-2">
          <form
            className="surface-card bg-white px-3 py-3 sm:px-4 flex items-end gap-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              void submitQuestion(input);
            }}
          >
            <button type="button" className="btn-icon w-9 h-9 shrink-0">
              <Plus size={17} />
            </button>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submitQuestion(input);
                }
              }}
              rows={1}
              placeholder="Pergunte alguma coisa..."
              className="flex-1 min-h-[42px] max-h-36 bg-transparent text-[15px] text-text-primary placeholder:text-text-tertiary outline-none resize-none leading-6 py-1.5 px-0.5"
            />

            <button type="button" className="btn-icon w-9 h-9 shrink-0 hidden sm:inline-flex">
              <Mic size={16} />
            </button>

            <button
              type="submit"
              disabled={!canSend}
              className="w-9 h-9 rounded-[10px] bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {sending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ArrowUp size={16} />
              )}
            </button>
          </form>

          <p className="mt-2 text-center text-[12px] text-text-tertiary">
            A elia pode cometer erros. Valide informações sensíveis com jurídico.
          </p>
        </div>
      </div>
    </div>
  );
}
