"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Credenciales incorrectas.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Error de conexion. Intentalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#ff914d]/60 focus:bg-white/[0.06]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,145,77,0.16),transparent_60%)]" />
      <form
        onSubmit={onSubmit}
        className="lg-panel relative w-full max-w-sm rounded-3xl p-8"
      >
        <h1 className="font-heading text-2xl font-bold text-white">
          Panel de stems
        </h1>
        <p className="mt-1.5 text-sm text-white/55">
          Acceso para administradores.
        </p>

        <div className="mt-7 space-y-4">
          <input
            type="text"
            autoComplete="username"
            placeholder="Usuario o email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="lg-orange mt-6 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-semibold text-black hover:scale-[1.01] disabled:opacity-60"
        >
          <LogIn className="size-5" />
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
