import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { enderecoDaImagem } from '../../api';
import { Carregando } from '../../components/carregando/carregando';
import { Agendamento, SITUACOES_AGENDAMENTO } from '../../models/agendamento';
import { AgendamentoService } from '../../services/agendamento.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemDeErro } from '../../services/mensagem-erro';

@Component({
  selector: 'app-meus-agendamentos',
  imports: [RouterLink, DatePipe, Carregando],
  templateUrl: './meus-agendamentos.html',
})
export class MeusAgendamentos {
  private readonly agendamentoService = inject(AgendamentoService);
  private readonly avisos = inject(AvisoService);

  protected readonly agendamentos = signal<Agendamento[]>([]);
  protected readonly carregando = signal(true);
  protected readonly situacoes = SITUACOES_AGENDAMENTO;
  protected readonly enderecoDaImagem = enderecoDaImagem;

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.agendamentoService.meus().subscribe({
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

  protected podeCancelar(agendamento: Agendamento): boolean {
    return agendamento.situacao === 'CONFIRMADO' && new Date(agendamento.inicio) > new Date();
  }

  protected cancelar(agendamento: Agendamento): void {
    if (!confirm(`Cancelar o test drive do ${agendamento.veiculo}?`)) {
      return;
    }
    this.agendamentoService.cancelar(agendamento.id).subscribe({
      next: () => {
        this.avisos.sucesso('Test drive cancelado. O horário ficou livre de novo.');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}
