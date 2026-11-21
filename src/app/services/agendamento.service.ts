import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../api';
import { Agendamento, SituacaoAgendamento } from '../models/agendamento';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private readonly http = inject(HttpClient);

  agendar(veiculoId: number, inicio: string): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${API}/agendamentos`, { veiculoId, inicio });
  }

  meus(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${API}/agendamentos/meus`);
  }

  cancelar(id: number): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${API}/agendamentos/${id}/cancelar`, {});
  }

  listarTodos(data: string, veiculoId: string, situacao: SituacaoAgendamento | ''): Observable<Agendamento[]> {
    let parametros = new HttpParams();
    if (data) {
      parametros = parametros.set('data', data);
    }
    if (veiculoId) {
      parametros = parametros.set('veiculoId', veiculoId);
    }
    if (situacao) {
      parametros = parametros.set('situacao', situacao);
    }
    return this.http.get<Agendamento[]>(`${API}/admin/agendamentos`, { params: parametros });
  }

  marcarRealizado(id: number): Observable<Agendamento> {
    return this.http.patch<Agendamento>(`${API}/admin/agendamentos/${id}/realizado`, {});
  }
}
