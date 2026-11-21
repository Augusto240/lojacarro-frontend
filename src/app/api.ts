export const API = '/api';

export function enderecoDaImagem(caminho: string | null): string {
  return caminho ? API + caminho : 'sem-foto.svg';
}
