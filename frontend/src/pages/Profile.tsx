import { useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  Lock,
  Mail,
  RefreshCw,
  Upload,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

type Message = { type: "success" | "error"; text: string } | null;

function mapProfileError(message?: string) {
  const msg = message ?? "Não foi possível salvar suas alterações.";
  if (msg.includes("bucket") || msg.includes("storage")) {
    return "Bucket de avatar não configurado. Rode as migrations do Supabase para habilitar upload de foto.";
  }
  return msg;
}

export function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userMetadata = useMemo(
    () =>
      ((user?.user_metadata as { full_name?: string; avatar_url?: string }) ?? {
        full_name: "",
        avatar_url: "",
      }),
    [user?.user_metadata],
  );

  const [fullName, setFullName] = useState(() => userMetadata.full_name ?? "");
  const [email, setEmail] = useState(() => user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(() => userMetadata.avatar_url ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const setSuccess = (text: string) => setMessage({ type: "success", text });
  const setError = (text: string) => setMessage({ type: "error", text });

  const handleSaveProfile = async () => {
    if (!user) return;
    setMessage(null);
    setSavingProfile(true);

    const currentFullName = (userMetadata.full_name ?? "").trim();
    const currentAvatar = userMetadata.avatar_url ?? "";
    const currentEmail = user.email ?? "";
    const nextFullName = fullName.trim();
    const nextEmail = email.trim().toLowerCase();
    const nextAvatar = avatarUrl.trim();

    const payload: {
      email?: string;
      data?: { full_name?: string | null; avatar_url?: string | null };
    } = {};

    if (nextEmail && nextEmail !== currentEmail) {
      payload.email = nextEmail;
    }

    if (nextFullName !== currentFullName || nextAvatar !== currentAvatar) {
      payload.data = {
        full_name: nextFullName || null,
        avatar_url: nextAvatar || null,
      };
    }

    if (!payload.email && !payload.data) {
      setSavingProfile(false);
      setSuccess("Nenhuma alteração para salvar.");
      return;
    }

    const { error } = await supabase.auth.updateUser(payload);
    setSavingProfile(false);

    if (error) {
      setError(mapProfileError(error.message));
      return;
    }

    if (payload.email) {
      setSuccess(
        "Perfil salvo. Verifique seu e-mail para confirmar a alteração de endereço.",
      );
    } else {
      setSuccess("Perfil atualizado com sucesso.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    setMessage(null);

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("A confirmação da senha não confere.");
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setError(mapProfileError(error.message));
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Senha atualizada com sucesso.");
  };

  const handleUploadAvatar = async (file?: File) => {
    if (!user || !file) return;
    setMessage(null);

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter até 5MB.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    setUploadingAvatar(true);
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
    setUploadingAvatar(false);

    if (uploadError) {
      setError(mapProfileError(uploadError.message));
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = data.publicUrl;
    setAvatarUrl(publicUrl);

    const { error: persistError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim() || null,
        avatar_url: publicUrl,
      },
    });

    if (persistError) {
      setError(mapProfileError(persistError.message));
      return;
    }

    setSuccess("Foto de perfil atualizada.");
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setAvatarUrl("");
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim() || null,
        avatar_url: null,
      },
    });
    if (error) {
      setError(mapProfileError(error.message));
      return;
    }
    setSuccess("Foto removida.");
  };

  return (
    <div className="page-shell">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-text-primary">Meu Perfil</h1>
        <p className="text-sm text-text-tertiary mt-1">
          Atualize seus dados pessoais e credenciais de acesso.
        </p>

        {message && (
          <div
            className={`mt-4 rounded-[10px] border px-3 py-2 text-sm ${message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        <section className="surface-card mt-6 p-5">
          <h2 className="text-base font-semibold text-text-primary mb-4">
            Informações de perfil
          </h2>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-[230px]">
              <div className="rounded-[12px] border border-base bg-[var(--color-surface-subtle)] p-4">
                <div className="w-24 h-24 rounded-full border border-base bg-white mx-auto flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-9 h-9 text-text-tertiary" />
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="btn-secondary w-full h-9 text-xs"
                  >
                    {uploadingAvatar ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Enviar foto
                  </button>
                  <button
                    onClick={handleRemoveAvatar}
                    className="btn-secondary w-full h-9 text-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Remover foto
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleUploadAvatar(event.target.files?.[0] ?? undefined)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Seu nome"
                  className="input-base"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  E-mail de acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input-base pl-9"
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="btn-primary"
                >
                  {savingProfile ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Salvar perfil
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card mt-5 p-5">
          <h2 className="text-base font-semibold text-text-primary mb-1">
            Alterar senha
          </h2>
          <p className="text-xs text-text-tertiary mb-4">
            Defina uma nova senha para sua conta.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Nova senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="input-base pl-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="input-base pl-9"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleUpdatePassword}
              disabled={savingPassword || !newPassword || !confirmPassword}
              className="btn-primary disabled:bg-slate-300 disabled:border-slate-300"
            >
              {savingPassword ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Atualizar senha
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
