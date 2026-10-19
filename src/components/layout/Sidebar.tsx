'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Power, RotateCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toggle } from '@/components/ui/Toggle';
import { usePainel } from '@/context/PainelContext';
import { api } from '@/services/api';
import { isActive, navGroups } from './navItems';
import type { NavItem } from './navItems';

/**
 * Conteúdo do menu lateral.
 *
 * - responsive: usado na barra fixa. No tablet (md) mostra só ícones,
 *   no computador (lg) mostra o menu completo.
 * - full: usado no menu do celular, sempre completo.
 */
type Variant = 'responsive' | 'full';

type SidebarProps = {
  variant: Variant;
  /** Chamado ao clicar num item (o menu do celular usa para fechar) */
  onNavigate?: () => void;
};

/** Classes que mudam entre o modo só-ícones (tablet) e o completo. */
function layoutFor(variant: Variant) {
  const responsive = variant === 'responsive';
  return {
    /** Visível só no modo completo; no modo ícones fica só para leitor de tela */
    label: responsive ? 'sr-only lg:not-sr-only' : '',
    /** Aparece só no modo completo */
    fullOnly: responsive ? 'hidden lg:flex' : 'flex',
    /** Aparece só no modo ícones */
    railOnly: responsive ? 'flex lg:hidden' : 'hidden',
    /** Alinhamento dos itens: centralizado no modo ícones */
    item: responsive ? 'justify-center lg:justify-start lg:px-3.5' : 'justify-start px-3.5',
    /** Alinhamento de logo e usuário */
    align: responsive ? 'justify-center lg:justify-start' : 'justify-start',
    /** Texto só para leitor de tela no modo ícones */
    railSrOnly: responsive ? 'sr-only lg:hidden' : 'hidden',
    /** Linha do usuário: empilhada no modo ícones */
    userRow: responsive
      ? 'flex flex-col items-center gap-2 px-1 lg:flex-row lg:gap-3'
      : 'flex items-center gap-3 px-1',
  };
}

type Css = ReturnType<typeof layoutFor>;

/** Bloco de carregamento visível sobre fundo branco */
const skeletonOnWhite = 'bg-brand-black/5! border-transparent! backdrop-blur-none!';

export function Sidebar({ variant, onNavigate }: SidebarProps) {
  const css = layoutFor(variant);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto rounded-2xl border border-brand-black/5 bg-white px-3 py-4 shadow-sm">
      <Brand css={css} />

      <nav aria-label="Menu do painel" className="flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <p
              className={`${css.fullOnly} px-3.5 pb-1 text-[11px] font-semibold tracking-wider text-gray-500 uppercase`}
            >
              {group.title}
            </p>
            <span
              aria-hidden="true"
              className={`${css.railOnly} mx-auto my-1 h-px w-8 bg-brand-black/10`}
            />
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} css={css} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <StoreStatusCard css={css} />
        <UserBlock css={css} />
      </div>
    </div>
  );
}

function Brand({ css }: { css: Css }) {
  return (
    <div className={`flex items-center gap-2.5 px-1 ${css.align}`}>
      <Image
        src="/logo.png"
        alt="Logo Visual Lanches e Petiscos"
        width={44}
        height={44}
        priority
        className="size-11 shrink-0 rounded-xl object-cover shadow-sm"
      />
      <div className={`${css.fullOnly} flex-col`}>
        <span className="text-lg leading-none font-black tracking-tight text-brand-black">
          VISUAL
        </span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
          Painel do restaurante
        </span>
      </div>
    </div>
  );
}

function NavLink({ item, css, onNavigate }: { item: NavItem; css: Css; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { contadores } = usePainel();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  const count =
    item.counter && contadores.state === 'ready' ? contadores.data[item.counter] : undefined;
  const loadingCount = item.counter && contadores.state === 'loading';

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      title={item.label}
      className={`relative flex h-11 items-center gap-3 rounded-xl text-[15px] transition-all ${css.item} ${
        active
          ? 'bg-brand-yellow font-semibold text-brand-black shadow-md shadow-brand-yellow/20'
          : 'font-medium text-gray-700 hover:bg-amber-50 hover:text-brand-black'
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`size-5 shrink-0 ${active ? 'text-brand-black' : 'text-amber-500'}`}
        strokeWidth={2.2}
      />
      <span className={css.label}>{item.label}</span>

      {loadingCount && (
        <Skeleton
          className={`${css.fullOnly} ${skeletonOnWhite} ml-auto h-6! w-7! rounded-full!`}
        />
      )}
      {count !== undefined && count > 0 && (
        <>
          {/* Número no menu completo */}
          <span
            className={`${css.fullOnly} ml-auto h-6 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
              active ? 'bg-brand-black text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {count}
            <span className="sr-only"> {item.counterLabel}</span>
          </span>
          {/* Bolinha com número no modo só-ícones */}
          <span
            aria-hidden="true"
            className={`${css.railOnly} absolute top-0 right-1 h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-black px-1 text-[10px] font-bold text-white`}
          >
            {count}
          </span>
        </>
      )}
    </Link>
  );
}

function StoreStatusCard({ css }: { css: Css }) {
  const { loja, salvandoLoja, erroAoSalvarLoja, alternarLoja, recarregar } = usePainel();

  if (loja.state === 'loading') {
    return (
      <div aria-busy="true" aria-label="Carregando status da loja">
        <div
          className={`${css.fullOnly} flex-col gap-3 rounded-xl border border-brand-black/5 bg-neutral-50 p-3`}
        >
          <div className="flex items-center gap-3">
            <Skeleton className={`${skeletonOnWhite} h-6! w-28! rounded-full!`} />
            <Skeleton className={`${skeletonOnWhite} ml-auto h-7! w-12! rounded-full!`} />
          </div>
          <Skeleton className={`${skeletonOnWhite} h-3! w-40!`} />
        </div>
        <Skeleton className={`${css.railOnly} ${skeletonOnWhite} mx-auto size-11! rounded-xl!`} />
      </div>
    );
  }

  if (loja.state === 'error') {
    return (
      <div>
        <div
          className={`${css.fullOnly} flex-col gap-2 rounded-xl border border-red-200 bg-red-50/50 p-3`}
        >
          <p className="text-sm font-medium text-red-600">{loja.error}</p>
          <button
            type="button"
            onClick={recarregar}
            className="min-h-[44px] rounded-xl border-2 border-brand-black px-3 text-sm font-semibold text-brand-black transition-all hover:bg-brand-black/5 active:scale-95"
          >
            Tentar de novo
          </button>
        </div>
        <button
          type="button"
          onClick={recarregar}
          aria-label={`${loja.error} Tentar de novo`}
          title="Status da loja não carregou. Tentar de novo"
          className={`${css.railOnly} mx-auto size-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600`}
        >
          <RotateCw aria-hidden="true" className="size-5" strokeWidth={2.4} />
        </button>
      </div>
    );
  }

  const { aberta } = loja.data;
  const acao = aberta ? 'Pausar recebimento de pedidos' : 'Voltar a receber pedidos';

  return (
    <div>
      {/* Cartão completo */}
      <div
        className={`${css.fullOnly} flex-col gap-1.5 rounded-xl border border-brand-black/5 bg-neutral-50 p-3`}
      >
        <div className="flex items-center justify-between gap-2">
          {aberta ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <span
                aria-hidden="true"
                className="size-2 animate-pulse rounded-full bg-emerald-500"
              />
              Loja aberta
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700">
              <span aria-hidden="true" className="size-2 rounded-full bg-gray-500" />
              Loja pausada
            </span>
          )}
          <Toggle
            checked={aberta}
            onChange={alternarLoja}
            ariaLabel={acao}
            disabled={salvandoLoja}
          />
        </div>
        <p className="text-xs leading-snug text-gray-500">
          {aberta
            ? 'Recebendo pedidos no site e no iFood'
            : 'Site e iFood não aceitam novos pedidos'}
        </p>
        <p aria-live="polite" className="text-xs font-medium empty:hidden">
          {salvandoLoja && <span className="text-gray-500">Salvando…</span>}
          {erroAoSalvarLoja && <span className="text-red-600">{erroAoSalvarLoja}</span>}
        </p>
      </div>

      {/* Botão compacto no modo só-ícones */}
      <button
        type="button"
        role="switch"
        aria-checked={aberta}
        aria-label={`${aberta ? 'Loja aberta' : 'Loja pausada'}. ${acao}`}
        title={`${aberta ? 'Loja aberta' : 'Loja pausada'} — ${acao.toLowerCase()}`}
        onClick={alternarLoja}
        disabled={salvandoLoja}
        className={`${css.railOnly} mx-auto size-11 items-center justify-center rounded-xl border transition-colors disabled:opacity-60 ${
          aberta
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
            : 'border-brand-black/10 bg-gray-100 text-gray-500'
        }`}
      >
        <Power aria-hidden="true" className="size-5" strokeWidth={2.6} />
      </button>
    </div>
  );
}

const nomePerfil = { admin: 'Admin', atendente: 'Atendente' } as const;

function UserBlock({ css }: { css: Css }) {
  const { usuario } = usePainel();
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    await api.sair();
    router.push('/login');
  }

  // Se der erro, o botão "Tentar de novo" da loja recarrega tudo, inclusive o usuário
  if (usuario.state === 'error') return null;

  if (usuario.state === 'loading') {
    return (
      <div className={`flex items-center gap-3 px-1 ${css.align}`} aria-hidden="true">
        <Skeleton className={`${skeletonOnWhite} size-10! shrink-0 rounded-full!`} />
        <span className={`${css.fullOnly} flex-col gap-1.5`}>
          <Skeleton className={`${skeletonOnWhite} h-3.5! w-20!`} />
          <Skeleton className={`${skeletonOnWhite} h-3! w-14!`} />
        </span>
      </div>
    );
  }

  const { nome, perfil } = usuario.data;
  const iniciais = nome
    .split(' ')
    .map((parte) => parte[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const botaoSair = (
    <button
      type="button"
      onClick={sair}
      disabled={saindo}
      aria-label="Sair do painel"
      title="Sair do painel"
      className="flex size-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-neutral-100 hover:text-brand-black disabled:opacity-50"
    >
      <LogOut aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
    </button>
  );

  return (
    <div className={css.userRow}>
      <div className={`flex min-w-0 grow items-center gap-3 ${css.align}`}>
        <span
          aria-hidden="true"
          title={`${nome} · ${nomePerfil[perfil]}`}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow/20 text-sm font-bold text-amber-800"
        >
          {iniciais}
        </span>
        <span className={`${css.fullOnly} min-w-0 flex-col`}>
          <span className="truncate text-sm font-semibold">{nome}</span>
          <span className="text-xs text-gray-500">{nomePerfil[perfil]}</span>
        </span>
        <span className={css.railSrOnly}>
          {nome}, {nomePerfil[perfil]}
        </span>
      </div>
      {botaoSair}
    </div>
  );
}
