import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../api';
import { Horario } from '../models/agendamento';
import { DadosVeiculo, FiltroVeiculo, Veiculo } from '../models/veiculo';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private readonly http = inject(HttpClient);

  listar(filtro: FiltroVeiculo = {}): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${API}/veiculos`, { params: montarParametros(filtro) });
  }

  detalhar(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${API}/veiculos/${id}`);
  }

  horarios(id: number, data: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${API}/veiculos/${id}/horarios`, { params: { data } });
  }

  listarTodos(filtro: FiltroVeiculo = {}): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${API}/admin/veiculos`, { params: montarParametros(filtro) });
  }

  cadastrar(dados: DadosVeiculo, foto: File): Observable<Veiculo> {
    const formulario = new FormData();
    formulario.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    formulario.append('foto', foto);
    return this.http.post<Veiculo>(`${API}/admin/veiculos`, formulario);
  }

  atualizar(id: number, dados: DadosVeiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${API}/admin/veiculos/${id}`, dados);
  }

  adicionarFoto(id: number, foto: File): Observable<Veiculo> {
    const formulario = new FormData();
    formulario.append('foto', foto);
    return this.http.post<Veiculo>(`${API}/admin/veiculos/${id}/fotos`, formulario);
  }

  removerFoto(id: number, fotoId: number): Observable<Veiculo> {
    return this.http.delete<Veiculo>(`${API}/admin/veiculos/${id}/fotos/${fotoId}`);
  }

  marcarVendido(id: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(`${API}/admin/veiculos/${id}/vendido`, {});
  }

  reativar(id: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(`${API}/admin/veiculos/${id}/reativar`, {});
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/admin/veiculos/${id}`);
  }
}

function montarParametros(filtro: FiltroVeiculo): HttpParams {
  let parametros = new HttpParams();
  if (filtro.busca) {
    parametros = parametros.set('busca', filtro.busca);
  }
  if (filtro.precoMin) {
    parametros = parametros.set('precoMin', filtro.precoMin);
  }
  if (filtro.precoMax) {
    parametros = parametros.set('precoMax', filtro.precoMax);
  }
  if (filtro.anoMin) {
    parametros = parametros.set('anoMin', filtro.anoMin);
  }
  if (filtro.anoMax) {
    parametros = parametros.set('anoMax', filtro.anoMax);
  }
  if (filtro.situacao) {
    parametros = parametros.set('situacao', filtro.situacao);
  }
  return parametros;
}
