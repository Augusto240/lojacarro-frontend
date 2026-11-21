import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('guarda o token e o usuário depois do login', () => {
    auth.entrar('admin@lojacarro.com', 'admin123').subscribe();

    http.expectOne('/api/auth/login').flush({
      token: 'abc',
      usuario: { id: 1, nome: 'Administrador', email: 'admin@lojacarro.com', telefone: null, perfil: 'ADMINISTRADOR' },
    });

    expect(auth.token()).toBe('abc');
    expect(auth.ehAdmin()).toBe(true);
  });

  it('sair apaga o token e o usuário', () => {
    localStorage.setItem('token', 'abc');

    auth.sair();

    expect(auth.token()).toBeNull();
    expect(auth.logado()).toBe(false);
  });
});
