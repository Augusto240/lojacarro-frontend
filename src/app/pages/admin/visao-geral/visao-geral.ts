import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Carregando } from '../../../components/carregando/carregando';
import { Agendamento } from '../../../models/agendamento';
import { Veiculo } from '../../../models/veiculo';
import { AgendamentoService } from '../../../services/agendamento.service';
import { VeiculoService } from '../../../services/veiculo.service';

@Component({
  selector: 'app-visao-geral',
  imports: [RouterLink, DatePipe, Carregando],
  templateUrl: './visao-geral.html',
})
export class VisaoGeral {
  private readonly veiculoService = inject(VeiculoService);
  private readonly agendamentoService = inject(AgendamentoService);

  protected readonly veiculos = signal<Veiculo[]>([]);
  protected readonly proximos = signal<Agendamento[]>([]);
  protected readonly carregando = signal(true);

  constructor() {
    this.veiculoService.listarTodos().subscribe((lista) => this.veiculos.set(lista));
    this.agendamentoService.listarTodos('', '', 'CONFIRMADO').subscribe((lista) => {
      const agora = new Date();
      this.proximos.set(lista.filter((agendamento) => new Date(agendamento.inicio) > agora));
      this.carregando.set(false);
    });
  }

  protected contar(situacao: string): number {
    return this.veiculos().filter((veiculo) => veiculo.situacao === situacao).length;
  }
}
