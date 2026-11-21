import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API } from '../api';
import { NovoUsuario, RespostaLogin, Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly usuario = signal<Usuario | null>(lerUsuarioSalvo());
  readonly logado = computed(() => this.usuario() !== null);
  readonly ehAdmin = computed(() => this.usuario()?.perfil === 'ADMINISTRADOR');
  readonly ehCliente = computed(() => this.usuario()?.perfil === 'CLIENTE');

  token(): string | null {
    return localStorage.getItem('token');
  }

  entrar(email: string, senha: string): Observable<RespostaLogin> {
    return this.http
      .post<RespostaLogin>(`${API}/auth/login`, { email, senha })
      .pipe(tap((resposta) => this.guardar(resposta)));
  }

  cadastrar(dados: NovoUsuario): Observable<RespostaLogin> {
    return this.http
      .post<RespostaLogin>(`${API}/auth/cadastro`, dados)
      .pipe(tap((resposta) => this.guardar(resposta)));
  }

  sair(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario.set(null);
  }

  private guardar(resposta: RespostaLogin): void {
    localStorage.setItem('token', resposta.token);
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
    this.usuario.set(resposta.usuario);
  }
}

function lerUsuarioSalvo(): Usuario | null {
  const salvo = localStorage.getItem('usuario');
  return salvo ? JSON.parse(salvo) : null;
}
