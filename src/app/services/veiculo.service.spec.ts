import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DadosVeiculo } from '../models/veiculo';
import { VeiculoService } from './veiculo.service';

describe('VeiculoService', () => {
  let service: VeiculoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VeiculoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('manda para a API só os filtros que foram preenchidos', () => {
    service.listar({ busca: 'civic', precoMax: 150000, anoMin: null }).subscribe();

    const requisicao = http.expectOne((r) => r.url === '/api/veiculos');
    expect(requisicao.request.params.get('busca')).toBe('civic');
    expect(requisicao.request.params.get('precoMax')).toBe('150000');
    expect(requisicao.request.params.has('anoMin')).toBe(false);
    requisicao.flush([]);
  });

  it('cadastra o veículo mandando os dados e a foto juntos', () => {
    const foto = new File(['imagem'], 'civic.png', { type: 'image/png' });
    const dados: DadosVeiculo = {
      marca: 'Honda',
      modelo: 'Civic',
      anoFabricacao: 2021,
      anoModelo: 2022,
      cor: 'Prata',
      quilometragem: 30000,
      combustivel: 'FLEX',
      transmissao: 'AUTOMATICA',
      preco: 125000,
      descricao: '',
    };

    service.cadastrar(dados, foto).subscribe();

    const requisicao = http.expectOne('/api/admin/veiculos');
    const corpo = requisicao.request.body as FormData;
    expect(requisicao.request.method).toBe('POST');
    expect(corpo.has('dados')).toBe(true);
    expect((corpo.get('foto') as File).name).toBe('civic.png');
    requisicao.flush({});
  });
});
