import { Veiculo } from './veiculo';

export interface Venda {
  id: number;
  veiculo: Veiculo;
  cliente: string;
  valor: number;
  dataVenda: string;
}

export interface DadosVenda {
  veiculoId: number;
  cliente: string;
  valor: number;
  dataVenda: string;
}

export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Lancamento {
  id: number;
  descricao: string;
  tipo: TipoLancamento;
  valor: number;
  data: string;
}

export interface DadosLancamento {
  descricao: string;
  tipo: TipoLancamento;
  valor: number;
  data: string;
}
