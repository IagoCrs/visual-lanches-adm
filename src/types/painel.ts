/** Tipos usados só no painel do restaurante. */

export type PerfilUsuario = 'admin' | 'atendente';

export interface UsuarioPainel {
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface CredenciaisLogin {
  email: string;
  senha: string;
  /** Só no modo mock: escolhe com qual perfil entrar */
  perfil: PerfilUsuario;
}

export interface ContadoresMenu {
  /** Pedidos esperando aceite */
  pedidosNovos: number;
  /** Pedidos agendados para hoje */
  agendadosHoje: number;
}
