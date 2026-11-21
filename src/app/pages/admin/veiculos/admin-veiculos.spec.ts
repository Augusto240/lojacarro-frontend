import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminVeiculos } from './admin-veiculos';

describe('AdminVeiculos', () => {
  let tela: AdminVeiculos;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminVeiculos],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(AdminVeiculos);
    TestBed.inject(HttpTestingController).expectOne((r) => r.url === '/api/admin/veiculos').flush([]);
    tela = fixture.componentInstance;
  });

  it('recusa arquivo que não é imagem antes de enviar', () => {
    tela['escolherFoto'](eventoComArquivo(new File(['x'], 'documento.pdf', { type: 'application/pdf' })));

    expect(tela['erroFoto']()).toContain('JPG, PNG ou WebP');
    expect(tela['foto']()).toBeNull();
  });

  it('recusa foto com mais de 5 MB', () => {
    const grande = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'grande.jpg', { type: 'image/jpeg' });

    tela['escolherFoto'](eventoComArquivo(grande));

    expect(tela['erroFoto']()).toContain('5 MB');
  });

  it('não salva veículo novo sem foto', () => {
    tela['form'].setValue({
      marca: 'Honda',
      modelo: 'Civic',
      anoFabricacao: 2021,
      anoModelo: 2022,
      cor: 'Prata',
      quilometragem: 0,
      combustivel: 'FLEX',
      transmissao: 'MANUAL',
      preco: 100000,
      descricao: '',
    });

    tela['salvar']();

    expect(tela['erroFoto']()).toBe('A foto é obrigatória.');
  });
});

function eventoComArquivo(arquivo: File): Event {
  return { target: { files: [arquivo], value: '' } } as unknown as Event;
}
