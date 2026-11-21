import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { enderecoDaImagem } from '../../api';
import { Carregando } from '../../components/carregando/carregando';
import { Horario } from '../../models/agendamento';
import { Veiculo } from '../../models/veiculo';
import { AgendamentoService } from '../../services/agendamento.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemDeErro } from '../../services/mensagem-erro';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  selector: 'app-agendar',
  imports: [FormsModule, RouterLink, DatePipe, CurrencyPipe, Carregando],
  templateUrl: './agendar.html',
})
export class Agendar implements OnInit {
  readonly id = input.required<string>();

  private readonly veiculoService = inject(VeiculoService);
  private readonly agendamentoService = inject(AgendamentoService);
  private readonly avisos = inject(AvisoService);
  private readonly router = inject(Router);

  protected readonly veiculo = signal<Veiculo | null>(null);
  protected readonly horarios = signal<Horario[]>([]);
  protected readonly carregandoHorarios = signal(false);
  protected readonly escolhido = signal<string | null>(null);
  protected readonly enviando = signal(false);

  protected readonly hoje = dataDeHoje();
  protected data = dataDeHoje();
  protected readonly enderecoDaImagem = enderecoDaImagem;

  ngOnInit(): void {
    this.veiculoService.detalhar(Number(this.id())).subscribe({
      next: (veiculo) => this.veiculo.set(veiculo),
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
    this.carregarHorarios();
  }

  protected carregarHorarios(): void {
    if (!this.data) {
      return;
    }
    this.escolhido.set(null);
    this.carregandoHorarios.set(true);
    this.veiculoService.horarios(Number(this.id()), this.data).subscribe({
      next: (lista) => {
        this.horarios.set(lista);
        this.carregandoHorarios.set(false);
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.carregandoHorarios.set(false);
      },
    });
  }

  protected proximoDia(): void {
    const dia = new Date(this.data + 'T12:00:00');
    dia.setDate(dia.getDate() + 1);
    this.data = dia.toISOString().slice(0, 10);
    this.carregarHorarios();
  }

  protected quantidadeLivre(): number {
    return this.horarios().filter((horario) => horario.livre).length;
  }

  protected confirmar(): void {
    const inicio = this.escolhido();
    if (!inicio) {
      return;
    }
    this.enviando.set(true);
    this.agendamentoService.agendar(Number(this.id()), inicio).subscribe({
      next: () => {
        this.avisos.sucesso('Test drive agendado!');
        this.router.navigate(['/meus-agendamentos']);
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.enviando.set(false);
        this.carregarHorarios();
      },
    });
  }
}

function dataDeHoje(): string {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}
