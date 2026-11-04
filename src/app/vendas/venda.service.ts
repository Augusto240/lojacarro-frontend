import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_LOJA } from '../core/api';
import { CrudApi } from '../core/crud-api';
import { LogService } from '../core/log.service';

export interface Venda {
  id: number;
  carroId: number;
  cliente: string;
  valor: number;
  dataVenda: string;
}

export type DadosVenda = Omit<Venda, 'id'>;

@Injectable({ providedIn: 'root' })
export class VendaService extends CrudApi<Venda, DadosVenda> {
  constructor() {
    super(inject(HttpClient), inject(LogService), `${API_LOJA}/vendas`, 'venda');
  }
}
