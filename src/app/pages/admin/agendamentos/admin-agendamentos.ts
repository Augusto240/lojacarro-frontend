import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Carregando } from '../../../components/carregando/carregando';
import { Agendamento, SITUACOES_AGENDAMENTO, SituacaoAgendamento } from '../../../models/agendamento';
import { Veiculo } from '../../../models/veiculo';
import { AgendamentoService } from '../../../services/agendamento.service';
import { AvisoService } from '../../../services/aviso.service';
import { mensagemDeErro } from '../../../services/mensagem-erro';
import { VeiculoService } from '../../../services/veiculo.service';

@Component({
  selector: 'app-admin-agendamentos',
  imports: [FormsModule, DatePipe, Carregando],
  templateUrl: './admin-agendamentos.html',
})
export class AdminAgendamentos {
  private readonly agendamentoService = inject(AgendamentoService);
  private readonly veiculoService = inject(VeiculoService);
  private readonly avisos = inject(AvisoService);

  protected readonly agendamentos = signal<Agendamento[]>([]);
  protected readonly veiculos = signal<Veiculo[]>([]);
  protected readonly carregando = signal(true);
  protected readonly situacoes = SITUACOES_AGENDAMENTO;

  protected data = '';
  protected veiculoId = '';
  protected situacao: SituacaoAgendamento | '' = '';

  constructor() {
    this.veiculoService.listarTodos().subscribe((lista) => this.veiculos.set(lista));
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.agendamentoService.listarTodos(this.data, this.veiculoId, this.situacao).subscribe({
      next: (lista) => {
        this.agendamentos.set(lista);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.carregando.set(false);
      },
    });
  }

  protected limpar(): void {
    this.data = '';
    this.veiculoId = '';
    this.situacao = '';
    this.carregar();
  }

  protected ehFuturo(agendamento: Agendamento): boolean {
    return new Date(agendamento.inicio) > new Date();
  }

  protected marcarRealizado(agendamento: Agendamento): void {
    this.agendamentoService.marcarRealizado(agendamento.id).subscribe({
      next: () => {
        this.avisos.sucesso('Test drive marcado como realizado');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected cancelar(agendamento: Agendamento): void {
    if (!confirm(`Cancelar o test drive de ${agendamento.cliente}?`)) {
      return;
    }
    this.agendamentoService.cancelar(agendamento.id).subscribe({
      next: () => {
        this.avisos.sucesso('Test drive cancelado');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}
