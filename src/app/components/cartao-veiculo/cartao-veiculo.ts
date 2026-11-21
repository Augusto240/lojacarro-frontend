import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { enderecoDaImagem } from '../../api';
import { TRANSMISSOES, Veiculo } from '../../models/veiculo';

@Component({
  selector: 'app-cartao-veiculo',
  imports: [RouterLink, CurrencyPipe, DecimalPipe],
  templateUrl: './cartao-veiculo.html',
})
export class CartaoVeiculo {
  readonly veiculo = input.required<Veiculo>();

  protected readonly transmissoes = TRANSMISSOES;
  protected readonly enderecoDaImagem = enderecoDaImagem;
}
