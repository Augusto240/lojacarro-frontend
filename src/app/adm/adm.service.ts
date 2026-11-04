import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_LOJA } from '../core/api';
import { CrudApi } from '../core/crud-api';
import { LogService } from '../core/log.service';

export interface Administrador {
  id: number;
  nome: string;
  email: string;
}

export type DadosAdministrador = Omit<Administrador, 'id'>;

@Injectable({ providedIn: 'root' })
export class AdmService extends CrudApi<Administrador, DadosAdministrador> {
  constructor() {
    super(inject(HttpClient), inject(LogService), `${API_LOJA}/adm/administradores`, 'administrador');
  }

  logs(quantidade: number): Observable<string[]> {
    this.log.info(`Pedindo as ultimas ${quantidade} operacoes ao modulo de log`);
    return this.http.get<string[]>(`${API_LOJA}/adm/logs`, { params: new HttpParams().set('quantidade', quantidade) });
  }
}
