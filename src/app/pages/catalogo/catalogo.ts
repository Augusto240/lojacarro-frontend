import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartaoVeiculo } from '../../components/cartao-veiculo/cartao-veiculo';
import { Carregando } from '../../components/carregando/carregando';
import { FiltroVeiculo, Veiculo } from '../../models/veiculo';
import { AvisoService } from '../../services/aviso.service';
import { mensagemDeErro } from '../../services/mensagem-erro';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  selector: 'app-catalogo',
  imports: [FormsModule, CartaoVeiculo, Carregando],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  private readonly veiculoService = inject(VeiculoService);
  private readonly avisos = inject(AvisoService);

  protected readonly veiculos = signal<Veiculo[]>([]);
  protected readonly carregando = signal(true);
  protected filtro: FiltroVeiculo = {};

  constructor() {
    this.buscar();
  }

  protected buscar(): void {
    this.carregando.set(true);
    this.veiculoService.listar(this.filtro).subscribe({
      next: (lista) => {
        this.veiculos.set(lista);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.carregando.set(false);
      },
    });
  }

  protected limpar(): void {
    this.filtro = {};
    this.buscar();
  }
}
