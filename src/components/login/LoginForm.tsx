'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ENV } from '@/config/env';
import { api } from '@/services/api';
import type { PerfilUsuario } from '@/types/painel';

type ErrosCampo = { email?: string; senha?: string };

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const opcoesPerfil = [
  { value: 'atendente', label: 'Atendente' },
  { value: 'admin', label: 'Admin' },
];

/** Tela de entrada do painel (ADM-02). O login de verdade entra no FUT-03. */
export function LoginForm() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario>('atendente');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<ErrosCampo>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  const modoTeste = ENV.dataSource === 'mock';

  function validar(): ErrosCampo {
    const novos: ErrosCampo = {};
    const emailLimpo = email.trim();
    if (!emailLimpo) novos.email = 'Informe seu e-mail.';
    else if (!EMAIL_VALIDO.test(emailLimpo)) {
      novos.email = 'Digite um e-mail válido, como nome@exemplo.com.';
    }
    if (!senha) novos.senha = 'Informe sua senha.';
    return novos;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (entrando) return;

    const novos = validar();
    setErros(novos);
    setErroGeral(null);
    if (novos.email) return emailRef.current?.focus();
    if (novos.senha) return senhaRef.current?.focus();

    setEntrando(true);
    const res = await api.entrar({ email: email.trim(), senha, perfil });
    if (res.success) {
      router.replace('/pedidos');
      return;
    }
    setEntrando(false);
    setErroGeral(res.error ?? 'Não foi possível entrar. Tente de novo.');
  }

  return (
    <div className="grid min-h-dvh bg-neutral-50 lg:grid-cols-2">
      {/* Banner da marca: só em telas grandes, mostrado inteiro (sem cortar) */}
      <div className="m-4 hidden flex-col justify-center gap-8 rounded-2xl bg-brand-black p-10 text-white shadow-sm lg:flex">
        <Image
          src="/banner.jpg"
          alt="Visual Lanches: hambúrguer, batatas e frango"
          width={1376}
          height={768}
          priority
          sizes="(min-width: 1024px) 45vw, 0px"
          className="h-auto w-full rounded-xl shadow-lg"
        />
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold text-brand-black">
            Painel do restaurante
          </span>
          <p className="max-w-md text-3xl leading-tight font-bold">
            Pedidos do site e do iFood num lugar só.
          </p>
          <p className="text-sm text-white/75">
            Agendados, cardápio e faturamento em poucos toques.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="/logo.png"
              alt="Visual Lanches e Petiscos"
              width={80}
              height={80}
              priority
              className="size-20 rounded-2xl object-cover shadow-md"
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Entrar no painel</h1>
              <p className="text-sm text-gray-500">Use o e-mail e a senha da equipe.</p>
            </div>
          </div>

          <Card>
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
              {erroGeral && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {erroGeral}
                </div>
              )}

              <Input
                ref={emailRef}
                label="E-mail"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="username"
                placeholder="nome@visuallanches.com.br"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (erros.email) setErros((atual) => ({ ...atual, email: undefined }));
                }}
                error={erros.email}
              />

              <Input
                ref={senhaRef}
                label="Senha"
                type={mostrarSenha ? 'text' : 'password'}
                name="senha"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (erros.senha) setErros((atual) => ({ ...atual, senha: undefined }));
                }}
                error={erros.senha}
                trailing={
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((v) => !v)}
                    aria-label={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
                    aria-pressed={mostrarSenha}
                    className="flex size-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-neutral-100 hover:text-brand-black"
                  >
                    {mostrarSenha ? (
                      <EyeOff aria-hidden="true" className="size-[18px]" />
                    ) : (
                      <Eye aria-hidden="true" className="size-[18px]" />
                    )}
                  </button>
                }
              />

              {modoTeste && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-brand-black/80">Entrar como</span>
                  <SegmentedControl
                    ariaLabel="Entrar como"
                    options={opcoesPerfil}
                    selected={perfil}
                    onChange={(valor) => setPerfil(valor as PerfilUsuario)}
                  />
                  <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    <Info aria-hidden="true" className="mt-px size-4 shrink-0" />
                    Modo de teste: qualquer e-mail e senha entram, com o perfil escolhido.
                  </p>
                </div>
              )}

              <Button type="submit" variant="primary" disabled={entrando} className="w-full">
                {entrando ? (
                  <>
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    Entrando…
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-gray-500">
            Esqueceu a senha? Fale com o responsável pela loja.
          </p>
        </div>
      </main>
    </div>
  );
}
