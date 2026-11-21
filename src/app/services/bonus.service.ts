import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../api';
import { DadosLancamento, DadosVenda, Lancamento, Venda } from '../models/bonus';
import { NovoUsuario, Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class BonusService {
  private readonly http = inject(HttpClient);

  listarVendas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${API}/vendas`);
  }

  salvarVenda(dados: DadosVenda, id?: number): Observable<Venda> {
    if (id) {
      return this.http.put<Venda>(`${API}/vendas/${id}`, dados);
    }
    return this.http.post<Venda>(`${API}/vendas`, dados);
  }

  excluirVenda(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/vendas/${id}`);
  }

  listarLancamentos(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(`${API}/contabilidade`);
  }

  salvarLancamento(dados: DadosLancamento, id?: number): Observable<Lancamento> {
    if (id) {
      return this.http.put<Lancamento>(`${API}/contabilidade/${id}`, dados);
    }
    return this.http.post<Lancamento>(`${API}/contabilidade`, dados);
  }

  excluirLancamento(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/contabilidade/${id}`);
  }

  listarAdministradores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API}/adm/administradores`);
  }

  criarAdministrador(dados: NovoUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${API}/adm/administradores`, dados);
  }

  excluirAdministrador(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/adm/administradores/${id}`);
  }

  ultimosLogs(): Observable<string[]> {
    return this.http.get<string[]>(`${API}/adm/logs`, { params: { quantidade: 30 } });
  }
}
