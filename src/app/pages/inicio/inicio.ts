import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartaoVeiculo } from '../../components/cartao-veiculo/cartao-veiculo';
import { Carregando } from '../../components/carregando/carregando';
import { Veiculo } from '../../models/veiculo';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CartaoVeiculo, Carregando],
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly veiculoService = inject(VeiculoService);

  protected readonly destaques = signal<Veiculo[]>([]);
  protected readonly carregando = signal(true);

  constructor() {
    this.veiculoService.listar().subscribe({
      next: (lista) => {
        this.destaques.set(lista.slice(0, 3));
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
