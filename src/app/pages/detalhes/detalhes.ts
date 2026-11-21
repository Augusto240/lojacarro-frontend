import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { enderecoDaImagem } from '../../api';
import { Carregando } from '../../components/carregando/carregando';
import { COMBUSTIVEIS, SITUACOES_VEICULO, TRANSMISSOES, Veiculo } from '../../models/veiculo';
import { AuthService } from '../../services/auth.service';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  selector: 'app-detalhes',
  imports: [RouterLink, CurrencyPipe, DecimalPipe, Carregando],
  templateUrl: './detalhes.html',
})
export class Detalhes implements OnInit {
  readonly id = input.required<string>();

  protected readonly auth = inject(AuthService);
  private readonly veiculoService = inject(VeiculoService);

  protected readonly veiculo = signal<Veiculo | null>(null);
  protected readonly fotoAberta = signal<string | null>(null);
  protected readonly naoEncontrado = signal(false);

  protected readonly combustiveis = COMBUSTIVEIS;
  protected readonly transmissoes = TRANSMISSOES;
  protected readonly situacoes = SITUACOES_VEICULO;
  protected readonly enderecoDaImagem = enderecoDaImagem;

  ngOnInit(): void {
    this.veiculoService.detalhar(Number(this.id())).subscribe({
      next: (veiculo) => {
        this.veiculo.set(veiculo);
        this.fotoAberta.set(veiculo.fotoPrincipal);
      },
      error: () => this.naoEncontrado.set(true),
    });
  }
}
