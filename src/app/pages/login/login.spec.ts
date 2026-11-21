import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Login } from './login';

describe('Login', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '**', children: [] }])],
    });
  });

  it('não chama a API com o formulário vazio e mostra os erros', async () => {
    const fixture = TestBed.createComponent(Login);
    const entrar = vi.spyOn(TestBed.inject(AuthService), 'entrar');
    await fixture.whenStable();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(entrar).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Informe um e-mail válido');
    expect(fixture.nativeElement.textContent).toContain('Informe a senha');
  });

  it('com e-mail e senha preenchidos faz o login', async () => {
    const fixture = TestBed.createComponent(Login);
    const entrar = vi.spyOn(TestBed.inject(AuthService), 'entrar').mockReturnValue(
      of({ token: 'abc', usuario: { id: 1, nome: 'Maria', email: 'maria@email.com', telefone: null, perfil: 'CLIENTE' } }),
    );
    await fixture.whenStable();

    digitar(fixture.nativeElement, '#email', 'maria@email.com');
    digitar(fixture.nativeElement, '#senha', 'cliente123');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(entrar).toHaveBeenCalledWith('maria@email.com', 'cliente123');
  });
});

function digitar(tela: HTMLElement, seletor: string, valor: string): void {
  const campo = tela.querySelector(seletor) as HTMLInputElement;
  campo.value = valor;
  campo.dispatchEvent(new Event('input'));
}
