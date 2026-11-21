import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Agendamento } from '../../models/agendamento';
import { MeusAgendamentos } from './meus-agendamentos';

describe('MeusAgendamentos', () => {
  it('só oferece cancelar para test drive confirmado e no futuro', async () => {
    TestBed.configureTestingModule({
      imports: [MeusAgendamentos],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(MeusAgendamentos);

    TestBed.inject(HttpTestingController)
      .expectOne('/api/agendamentos/meus')
      .flush([
        agendamento(1, '2099-01-10T10:00:00', 'CONFIRMADO'),
        agendamento(2, '2020-01-10T10:00:00', 'CONFIRMADO'),
        agendamento(3, '2099-01-11T10:00:00', 'CANCELADO'),
      ]);
    await fixture.whenStable();

    const tela: HTMLElement = fixture.nativeElement;
    expect(tela.querySelectorAll('.item-agendamento').length).toBe(3);
    expect(tela.querySelectorAll('.item-agendamento .perigo').length).toBe(1);
  });
});

function agendamento(id: number, inicio: string, situacao: Agendamento['situacao']): Agendamento {
  return {
    id,
    veiculoId: 1,
    veiculo: 'Honda Civic 2022',
    fotoVeiculo: null,
    clienteId: 1,
    cliente: 'Maria',
    emailCliente: 'maria@email.com',
    telefoneCliente: null,
    inicio,
    fim: inicio,
    situacao,
  };
}
