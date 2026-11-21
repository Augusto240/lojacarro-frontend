import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Agendar } from './agendar';

describe('Agendar', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Agendar],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('só libera o botão de confirmar depois de escolher um horário livre', async () => {
    const fixture = TestBed.createComponent(Agendar);
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();

    http.expectOne('/api/veiculos/1').flush({ id: 1, marca: 'Honda', modelo: 'Civic', fotoPrincipal: null, preco: 1 });
    http.expectOne((r) => r.url === '/api/veiculos/1/horarios').flush([
      { inicio: '2030-01-10T10:00:00', livre: false },
      { inicio: '2030-01-10T10:30:00', livre: true },
    ]);
    await fixture.whenStable();

    const tela: HTMLElement = fixture.nativeElement;
    const horarios = tela.querySelectorAll<HTMLButtonElement>('.horario');
    const confirmar = tela.querySelector<HTMLButtonElement>('.confirmacao .botao')!;

    expect(horarios[0].disabled).toBe(true);
    expect(confirmar.disabled).toBe(true);

    horarios[1].click();
    await fixture.whenStable();

    expect(confirmar.disabled).toBe(false);
  });
});
