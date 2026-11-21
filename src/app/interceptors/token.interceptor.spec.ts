import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tokenInterceptor } from './token.interceptor';

describe('tokenInterceptor', () => {
  let http: HttpTestingController;

  function preparar(): HttpClient {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([tokenInterceptor])), provideHttpClientTesting(), provideRouter([{ path: '**', children: [] }])],
    });
    http = TestBed.inject(HttpTestingController);
    return TestBed.inject(HttpClient);
  }

  beforeEach(() => localStorage.clear());

  it('coloca o token no cabeçalho Authorization', () => {
    localStorage.setItem('token', 'abc123');

    preparar().get('/api/agendamentos/meus').subscribe();

    const requisicao = http.expectOne('/api/agendamentos/meus');
    expect(requisicao.request.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('sem login não manda cabeçalho nenhum', () => {
    preparar().get('/api/veiculos').subscribe();

    expect(http.expectOne('/api/veiculos').request.headers.has('Authorization')).toBe(false);
  });

  it('quando a API responde 401 o usuário é deslogado', () => {
    localStorage.setItem('token', 'vencido');
    localStorage.setItem('usuario', JSON.stringify({ id: 1, nome: 'Maria', perfil: 'CLIENTE' }));
    const cliente = preparar();
    const auth = TestBed.inject(AuthService);

    cliente.get('/api/agendamentos/meus').subscribe({ error: () => {} });
    http.expectOne('/api/agendamentos/meus').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(auth.logado()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
