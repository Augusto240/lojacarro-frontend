import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';

const rota = {} as ActivatedRouteSnapshot;
const estado = { url: '/meus-agendamentos' } as RouterStateSnapshot;

describe('Guards', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('manda para o login quem não está logado', () => {
    const resultado = TestBed.runInInjectionContext(() => authGuard(rota, estado));

    expect(resultado).toBeInstanceOf(UrlTree);
    expect(String(resultado)).toBe('/login?voltar=%2Fmeus-agendamentos');
  });

  it('barra o cliente na área do administrador', () => {
    entrarComo('CLIENTE');

    const resultado = TestBed.runInInjectionContext(() => adminGuard(rota, estado));

    expect(String(resultado)).toBe('/');
  });

  it('deixa o administrador entrar no painel', () => {
    entrarComo('ADMINISTRADOR');

    const resultado = TestBed.runInInjectionContext(() => adminGuard(rota, estado));

    expect(resultado).toBe(true);
  });
});

function entrarComo(perfil: string): void {
  localStorage.setItem('usuario', JSON.stringify({ id: 1, nome: 'Teste', email: 't@t.com', telefone: null, perfil }));
}
