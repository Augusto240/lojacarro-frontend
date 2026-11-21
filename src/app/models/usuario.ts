export type Perfil = 'ADMINISTRADOR' | 'CLIENTE';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  perfil: Perfil;
}

export interface RespostaLogin {
  token: string;
  usuario: Usuario;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}
