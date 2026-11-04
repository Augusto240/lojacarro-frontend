import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogService } from './log.service';

export class CrudApi<T, D> {
  constructor(
    protected readonly http: HttpClient,
    protected readonly log: LogService,
    private readonly url: string,
    private readonly nome: string,
  ) {}

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  criar(dados: D): Observable<T> {
    this.log.info(`Cadastrando ${this.nome}`, dados);
    return this.http.post<T>(this.url, dados);
  }

  atualizar(id: number, dados: D): Observable<T> {
    this.log.info(`Atualizando ${this.nome} ${id}`, dados);
    return this.http.put<T>(`${this.url}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    this.log.info(`Excluindo ${this.nome} ${id}`);
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
