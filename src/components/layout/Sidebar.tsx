'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Power, RotateCw } from 'lucide-react';
import { usePainel } from '@/context/PainelContext';
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
    item: responsive ? 'justify-center lg:justify-start lg:px-4' : 'justify-start px-4',
    /** Alinhamento de logo e usuário */
    align: responsive ? 'justify-center lg:justify-start' : 'justify-start',
    /** Texto só para leitor de tela no modo ícones */
    railSrOnly: responsive ? 'sr-only lg:hidden' : 'hidden',
  };
}

export function Sidebar({ variant, onNavigate }: SidebarProps) {
  const css = layoutFor(variant);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto rounded-[1.75rem] bg-brand-black px-3 py-4 text-side-text">
      <Brand css={css} />

      <nav aria-label="Menu do painel" className="flex flex-col gap-5">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <p
              className={`${css.fullOnly} px-4 pb-1 text-[11px] font-black tracking-[0.08em] text-side-label uppercase`}
            >
              {group.title}
            </p>
            <span
              aria-hidden="true"
              className={`${css.railOnly} mx-auto my-1 h-px w-8 bg-side-panel-2`}
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

type Css = ReturnType<typeof layoutFor>;

function Brand({ css }: { css: Css }) {
  return (
    <div className={`flex items-center gap-3 px-1 ${css.align}`}>
      <Image
        src="/logo-visual.png"
        alt="Lanches e Petiscos Visual"
        width={52}
        height={52}
        priority
        className="size-12 shrink-0 rounded-2xl object-cover"
      />
      <div className={`${css.fullOnly} flex-col leading-none`}>
        <span className="font-display text-[22px] font-extrabold text-brand-yellow uppercase">
          Visual Lanches
        </span>
        <span className="mt-1 text-xs font-bold text-side-muted">Painel do restaurante</span>
      </div>
    </div>
  );
}

function NavLink({ item, css, onNavigate }: { item: NavItem; css: Css; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { counters } = usePainel();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  const count =
    item.counter && counters.state === 'ready' ? counters.data[item.counter] : undefined;
  const loadingCount = item.counter && counters.state === 'loading';

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      title={item.label}
      className={`relative flex h-12 items-center gap-3 rounded-2xl text-[15px] transition-colors ${css.item} ${
        active
          ? 'bg-brand-yellow font-black text-brand-black'
          : 'font-bold text-side-text hover:bg-side-panel'
      }`}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.2} />
      <span className={css.label}>{item.label}</span>

      {/* Número completo (menu aberto) */}
      {loadingCount && (
        <span
          aria-hidden="true"
          className={`${css.fullOnly} skeleton-dark ml-auto h-6 w-7 rounded-full`}
        />
      )}
      {count !== undefined && count > 0 && (
        <>
          <span
            className={`${css.fullOnly} ml-auto h-6 min-w-7 items-center justify-center rounded-full px-2 text-xs font-black ${
              active ? 'bg-brand-black text-brand-yellow' : 'bg-side-panel-2 text-brand-yellow'
            }`}
          >
            {count}
            <span className="sr-only"> {item.counterLabel}</span>
          </span>
          {/* Bolinha com número no modo só-ícones */}
          <span
            aria-hidden="true"
            className={`${css.railOnly} absolute top-0.5 right-1 h-5 min-w-5 items-center justify-center rounded-full border-2 border-brand-black bg-brand-yellow px-1 text-[10px] font-black text-brand-black`}
          >
            {count}
          </span>
        </>
      )}
    </Link>
  );
}

function StoreStatusCard({ css }: { css: Css }) {
  const { store, savingStore, storeSaveError, toggleStore, reload } = usePainel();

  if (store.state === 'loading') {
    return (
      <div aria-busy="true" aria-label="Carregando status da loja">
        <div className={`${css.fullOnly} flex-col gap-3 rounded-[1.25rem] bg-side-panel p-4`}>
          <div className="flex items-center gap-3">
            <span className="skeleton-dark h-4 w-28" />
            <span className="skeleton-dark ml-auto h-7 w-12 rounded-full" />
          </div>
          <span className="skeleton-dark h-3 w-40" />
        </div>
        <span className={`${css.railOnly} skeleton-dark mx-auto size-12 rounded-2xl`} />
      </div>
    );
  }

  if (store.state === 'error') {
    return (
      <div>
        <div className={`${css.fullOnly} flex-col gap-2 rounded-[1.25rem] bg-side-panel p-4`}>
          <p className="text-sm font-bold text-side-text">{store.error}</p>
          <button
            type="button"
            onClick={reload}
            className="h-11 rounded-xl border border-side-panel-2 px-3 text-sm font-black text-brand-yellow hover:bg-side-panel-2"
          >
            Tentar de novo
          </button>
        </div>
        <button
          type="button"
          onClick={reload}
          aria-label={`${store.error} Tentar de novo`}
          title="Status da loja não carregou. Tentar de novo"
          className={`${css.railOnly} mx-auto size-12 items-center justify-center rounded-2xl bg-side-panel text-brand-yellow`}
        >
          <RotateCw aria-hidden="true" className="size-5" strokeWidth={2.4} />
        </button>
      </div>
    );
  }

  const { isOpen, closesAt } = store.data;
  const title = isOpen ? 'Loja aberta' : 'Loja pausada';
  const detail = isOpen
    ? `Recebendo pedidos no site e no iFood · fecha às ${closesAt}`
    : 'Site e iFood não aceitam novos pedidos';
  const action = isOpen ? 'Pausar recebimento de pedidos' : 'Voltar a receber pedidos';

  return (
    <div>
      {/* Cartão completo */}
      <div className={`${css.fullOnly} flex-col gap-2 rounded-[1.25rem] bg-side-panel p-4`}>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`size-2.5 shrink-0 rounded-full ${isOpen ? 'bg-ok shadow-[0_0_0_4px_rgb(31_183_108/0.25)]' : 'bg-paused'}`}
          />
          <span className="grow text-[15px] font-black">{title}</span>
          <StoreSwitch
            isOpen={isOpen}
            disabled={savingStore}
            onToggle={toggleStore}
            label={action}
          />
        </div>
        <p className="text-xs leading-snug font-semibold text-side-muted">{detail}</p>
        <p aria-live="polite" className="text-xs font-bold">
          {savingStore && <span className="text-side-muted">Salvando…</span>}
          {storeSaveError && <span className="text-[#ff9b8f]">{storeSaveError}</span>}
        </p>
      </div>

      {/* Botão compacto no modo só-ícones */}
      <button
        type="button"
        role="switch"
        aria-checked={isOpen}
        aria-label={`${title}. ${action}`}
        title={`${title} — ${action.toLowerCase()}`}
        onClick={toggleStore}
        disabled={savingStore}
        className={`${css.railOnly} mx-auto size-12 items-center justify-center rounded-2xl transition-colors disabled:opacity-60 ${
          isOpen ? 'bg-ok text-brand-black' : 'bg-side-panel-2 text-side-muted'
        }`}
      >
        <Power aria-hidden="true" className="size-5" strokeWidth={2.6} />
      </button>
    </div>
  );
}

function StoreSwitch({
  isOpen,
  disabled,
  onToggle,
  label,
}: {
  isOpen: boolean;
  disabled: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOpen}
      aria-label={label}
      title={label}
      onClick={onToggle}
      disabled={disabled}
      className="flex h-11 w-14 shrink-0 items-center justify-end disabled:opacity-60"
    >
      <span
        className={`flex h-[30px] w-[52px] items-center rounded-full p-[3px] transition-colors ${
          isOpen ? 'bg-ok' : 'bg-[#4a453c]'
        }`}
      >
        <span
          className={`size-6 rounded-full bg-white shadow transition-transform ${
            isOpen ? 'translate-x-[22px]' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}

const roleLabel = { admin: 'Admin', atendente: 'Atendente' } as const;

function UserBlock({ css }: { css: Css }) {
  const { user } = usePainel();

  // Se der erro, o botão "Tentar de novo" da loja recarrega tudo, inclusive o usuário
  if (user.state === 'error') return null;

  if (user.state === 'loading') {
    return (
      <div className={`flex items-center gap-3 px-1 ${css.align}`} aria-hidden="true">
        <span className="skeleton-dark size-10 shrink-0 rounded-[0.875rem]" />
        <span className={`${css.fullOnly} flex-col gap-1.5`}>
          <span className="skeleton-dark h-3.5 w-20" />
          <span className="skeleton-dark h-3 w-14" />
        </span>
      </div>
    );
  }

  const { name, role } = user.data;
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 px-1 ${css.align}`}
      title={`${name} · ${roleLabel[role]}`}
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-[0.875rem] bg-side-panel-2 font-black text-brand-yellow"
      >
        {initials}
      </span>
      <span className={`${css.fullOnly} min-w-0 flex-col`}>
        <span className="truncate text-sm font-black">{name}</span>
        <span className="text-xs font-bold text-side-muted">{roleLabel[role]}</span>
      </span>
      <span className={css.railSrOnly}>
        {name}, {roleLabel[role]}
      </span>
    </div>
  );
}
