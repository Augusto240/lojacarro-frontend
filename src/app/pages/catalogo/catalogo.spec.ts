import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Veiculo } from '../../models/veiculo';
import { Catalogo } from './catalogo';

describe('Catalogo', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Catalogo],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('mostra um cartão para cada veículo que a API devolve', async () => {
    const fixture = TestBed.createComponent(Catalogo);

    http.expectOne('/api/veiculos').flush([veiculo(1, 'Civic'), veiculo(2, 'Corolla')]);
    await fixture.whenStable();

    const tela: HTMLElement = fixture.nativeElement;
    expect(tela.querySelectorAll('app-cartao-veiculo').length).toBe(2);
    expect(tela.textContent).toContain('Civic');
    expect(tela.textContent).toContain('Corolla');
  });

  it('avisa quando nenhum veículo é encontrado', async () => {
    const fixture = TestBed.createComponent(Catalogo);

    http.expectOne('/api/veiculos').flush([]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Nenhum veículo encontrado');
  });
});

function veiculo(id: number, modelo: string): Veiculo {
  return {
    id,
    marca: 'Marca',
    modelo,
    anoFabricacao: 2022,
    anoModelo: 2022,
    cor: 'Prata',
    quilometragem: 10000,
    combustivel: 'FLEX',
    transmissao: 'MANUAL',
    preco: 100000,
    descricao: null,
    situacao: 'DISPONIVEL',
    fotoPrincipal: null,
    fotos: [],
  };
}
