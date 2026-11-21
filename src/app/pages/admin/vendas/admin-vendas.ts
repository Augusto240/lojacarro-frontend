import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carregando } from '../../../components/carregando/carregando';
import { Venda } from '../../../models/bonus';
import { Veiculo } from '../../../models/veiculo';
import { AvisoService } from '../../../services/aviso.service';
import { BonusService } from '../../../services/bonus.service';
import { mensagemDeErro } from '../../../services/mensagem-erro';
import { VeiculoService } from '../../../services/veiculo.service';

@Component({
  selector: 'app-admin-vendas',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, Carregando],
  templateUrl: './admin-vendas.html',
})
export class AdminVendas {
  private readonly bonus = inject(BonusService);
  private readonly veiculoService = inject(VeiculoService);
  private readonly avisos = inject(AvisoService);

  protected readonly vendas = signal<Venda[]>([]);
  protected readonly disponiveis = signal<Veiculo[]>([]);
  protected readonly carregando = signal(true);
  protected readonly editando = signal<Venda | null>(null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    veiculoId: [0, [Validators.required, Validators.min(1)]],
    cliente: ['', [Validators.required, Validators.maxLength(100)]],
    valor: [0, [Validators.required, Validators.min(1)]],
    dataVenda: [hoje(), Validators.required],
  });

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.veiculoService.listar().subscribe((lista) => this.disponiveis.set(lista));
    this.bonus.listarVendas().subscribe({
      next: (lista) => {
        this.vendas.set(lista);
        this.carregando.set(false);
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.carregando.set(false);
      },
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = { ...this.form.getRawValue(), veiculoId: Number(this.form.getRawValue().veiculoId) };
    this.bonus.salvarVenda(dados, this.editando()?.id).subscribe({
      next: () => {
        this.avisos.sucesso('Venda salva. O veículo saiu do catálogo.');
        this.cancelar();
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected editar(venda: Venda): void {
    this.editando.set(venda);
    this.form.setValue({
      veiculoId: venda.veiculo.id,
      cliente: venda.cliente,
      valor: venda.valor,
      dataVenda: venda.dataVenda,
    });
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.form.reset({ veiculoId: 0, cliente: '', valor: 0, dataVenda: hoje() });
  }

  protected excluir(venda: Venda): void {
    if (!confirm(`Excluir a venda #${venda.id}? O veículo volta para o catálogo.`)) {
      return;
    }
    this.bonus.excluirVenda(venda.id).subscribe({
      next: () => {
        this.avisos.sucesso('Venda excluída');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}
