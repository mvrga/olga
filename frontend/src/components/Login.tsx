"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { AlertTriangle, Eye, EyeOff, Sprout } from "lucide-react";
import { authLogin, authSignup } from "@/lib/api";

type Mode = "login" | "signup" | "reset";

export function Login({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await authSignup({ name, email, password });
        if (!res.ok) throw new Error(res.error || "Erro ao criar conta");
      }
      if (mode === "login" || mode === "signup") {
        const res = await authLogin({ email, password });
        if (!res.ok || !res.token) throw new Error(res.error || "Credenciais inválidas");
        localStorage.setItem("auth_token", res.token);
        onAuthenticated();
      } else {
        // reset de senha fictício
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (e) {
      setError("Falha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md overflow-hidden border">
        <div className="bg-green-600 px-6 py-5 text-white flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Sprout className="size-6 text-white" />
          </div>
          <div>
            <p className="text-lg">MeuAgronomo</p>
            <p className="text-xs text-green-100">Plataforma para Agricultores</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="mb-2">
            <p className="text-gray-900 text-lg">
              {mode === "login" && "Entrar"}
              {mode === "signup" && "Criar conta"}
              {mode === "reset" && "Recuperar senha"}
            </p>
            <p className="text-gray-600 text-sm">
              {mode === "login" && "Acesse sua conta para continuar"}
              {mode === "signup" && "Preencha seus dados para começar"}
              {mode === "reset" && "Enviaremos instruções para seu e-mail"}
            </p>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              <AlertTriangle className="size-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            {loading ? "Carregando…" : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar"}
          </Button>

          <div className="flex items-center justify-between text-sm text-gray-600">
            {mode !== "reset" ? (
              <button type="button" onClick={() => setMode("reset")} className="hover:text-gray-900">
                Esqueci minha senha
              </button>
            ) : (
              <button type="button" onClick={() => setMode("login")} className="hover:text-gray-900">
                Voltar ao login
              </button>
            )}

            {mode === "login" ? (
              <button type="button" onClick={() => setMode("signup")} className="hover:text-gray-900">
                Criar conta
              </button>
            ) : mode === "signup" ? (
              <button type="button" onClick={() => setMode("login")} className="hover:text-gray-900">
                Já tenho conta
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
