export type SituacaoAgendamento = 'CONFIRMADO' | 'CANCELADO' | 'REALIZADO';

export interface Agendamento {
  id: number;
  veiculoId: number;
  veiculo: string;
  fotoVeiculo: string | null;
  clienteId: number;
  cliente: string;
  emailCliente: string;
  telefoneCliente: string | null;
  inicio: string;
  fim: string;
  situacao: SituacaoAgendamento;
}

export interface Horario {
  inicio: string;
  livre: boolean;
}

export const SITUACOES_AGENDAMENTO: Record<SituacaoAgendamento, string> = {
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  REALIZADO: 'Realizado',
};
