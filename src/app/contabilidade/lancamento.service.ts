import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_LOJA } from '../core/api';
import { CrudApi } from '../core/crud-api';
import { LogService } from '../core/log.service';

export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Lancamento {
  id: number;
  descricao: string;
  tipo: TipoLancamento;
  valor: number;
  data: string;
}

export type DadosLancamento = Omit<Lancamento, 'id'>;

@Injectable({ providedIn: 'root' })
export class LancamentoService extends CrudApi<Lancamento, DadosLancamento> {
  constructor() {
    super(inject(HttpClient), inject(LogService), `${API_LOJA}/contabilidade`, 'lancamento');
  }
}
