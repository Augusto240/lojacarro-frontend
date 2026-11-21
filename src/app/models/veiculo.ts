export type Combustivel = 'GASOLINA' | 'ETANOL' | 'FLEX' | 'DIESEL' | 'ELETRICO' | 'HIBRIDO';
export type Transmissao = 'MANUAL' | 'AUTOMATICA';
export type SituacaoVeiculo = 'DISPONIVEL' | 'VENDIDO' | 'INATIVO';

export interface Foto {
  id: number;
  url: string;
  principal: boolean;
}

export interface Veiculo {
  id: number;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  cor: string;
  quilometragem: number;
  combustivel: Combustivel;
  transmissao: Transmissao;
  preco: number;
  descricao: string | null;
  situacao: SituacaoVeiculo;
  fotoPrincipal: string | null;
  fotos: Foto[];
}

export interface DadosVeiculo {
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  cor: string;
  quilometragem: number;
  combustivel: Combustivel;
  transmissao: Transmissao;
  preco: number;
  descricao: string;
}

export interface FiltroVeiculo {
  busca?: string;
  precoMin?: number | null;
  precoMax?: number | null;
  anoMin?: number | null;
  anoMax?: number | null;
  situacao?: SituacaoVeiculo | '';
}

export const COMBUSTIVEIS: Record<Combustivel, string> = {
  GASOLINA: 'Gasolina',
  ETANOL: 'Etanol',
  FLEX: 'Flex',
  DIESEL: 'Diesel',
  ELETRICO: 'Elétrico',
  HIBRIDO: 'Híbrido',
};

export const TRANSMISSOES: Record<Transmissao, string> = {
  MANUAL: 'Manual',
  AUTOMATICA: 'Automática',
};

export const SITUACOES_VEICULO: Record<SituacaoVeiculo, string> = {
  DISPONIVEL: 'Disponível',
  VENDIDO: 'Vendido',
  INATIVO: 'Inativo',
};
