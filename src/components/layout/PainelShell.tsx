'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { usePainel } from '@/context/PainelContext';
import { Sidebar } from './Sidebar';

/**
 * Estrutura que todas as telas do painel usam.
 *
 * - Computador (lg, 1024 px+): menu lateral completo
 * - Tablet em pé (md, 768–1023 px): menu lateral só com ícones
 * - Celular (até 767 px): barra no topo + menu que abre por um botão
 */
export function PainelShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    openButtonRef.current?.focus();
  }, []);

  // Fecha o menu do celular ao trocar de tela
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Menu aberto: foco no botão de fechar, Esc fecha, página de trás não rola
  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, closeMenu]);

  return (
    <div className="min-h-dvh md:flex">
      {/* Menu fixo: tablet e computador */}
      <aside className="sticky top-0 hidden h-dvh w-[100px] shrink-0 p-3 md:block lg:w-[272px]">
        <Sidebar variant="responsive" />
      </aside>

      {/* Barra do topo: celular */}
      <MobileTopBar
        buttonRef={openButtonRef}
        expanded={menuOpen}
        onOpen={() => setMenuOpen(true)}
      />

      {/* Menu que abre por cima: celular */}
      <div className="md:hidden">
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={closeMenu}
          className={`fixed inset-0 z-40 bg-brand-black/50 transition-opacity ${
            menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />
        <div
          id="menu-celular"
          role="dialog"
          aria-modal="true"
          aria-label="Menu do painel"
          inert={!menuOpen}
          className={`fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] p-2 transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            aria-label="Fechar menu"
            className="absolute top-5 right-5 z-10 flex size-11 items-center justify-center rounded-2xl bg-side-panel text-white"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={2.6} />
          </button>
          <Sidebar variant="full" onNavigate={() => setMenuOpen(false)} />
        </div>
      </div>

      <main id="conteudo" className="min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

function MobileTopBar({
  buttonRef,
  expanded,
  onOpen,
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  expanded: boolean;
  onOpen: () => void;
}) {
  const { store, counters } = usePainel();
  const newOrders = counters.state === 'ready' ? counters.data.newOrders : 0;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-brand-black px-3 py-2.5 text-white md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label={newOrders > 0 ? `Abrir menu, ${newOrders} pedidos novos` : 'Abrir menu'}
        aria-expanded={expanded}
        aria-controls="menu-celular"
        className="relative flex size-11 items-center justify-center rounded-2xl bg-side-panel"
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={2.6} />
        {newOrders > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-brand-black bg-brand-yellow px-1 text-[10px] font-black text-brand-black"
          >
            {newOrders}
          </span>
        )}
      </button>

      <Image
        src="/logo-visual.png"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-xl object-cover"
      />
      <span className="font-display text-xl font-extrabold text-brand-yellow uppercase">
        Visual Lanches
      </span>

      <span className="ml-auto">
        {store.state === 'loading' && (
          <span className="skeleton-dark block h-7 w-20 rounded-full" />
        )}
        {store.state === 'ready' && (
          <span
            className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-black ${
              store.data.isOpen ? 'bg-ok-soft text-ok-dark' : 'bg-side-panel-2 text-side-text'
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${store.data.isOpen ? 'bg-ok' : 'bg-paused'}`}
            />
            {store.data.isOpen ? 'Aberta' : 'Pausada'}
          </span>
        )}
      </span>
    </header>
  );
}
