import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carro } from '../carros/carro.model';
import { CarroService } from '../carros/carro.service';
import { AvisoService } from '../core/aviso.service';
import { mensagemDeErro } from '../core/mensagem-erro';
import { UsuarioService } from '../usuarios/usuario.service';
import { Venda, VendaService } from './venda.service';

@Component({
  selector: 'app-pagina-vendas',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './pagina-vendas.html',
})
export class PaginaVendas {
  protected readonly usuarios = inject(UsuarioService);
  private readonly vendaService = inject(VendaService);
  private readonly carroService = inject(CarroService);
  private readonly avisos = inject(AvisoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly vendas = signal<Venda[]>([]);
  protected readonly carros = signal<Carro[]>([]);
  protected readonly editando = signal<Venda | null>(null);

  protected readonly form = this.fb.group({
    carroId: [0, [Validators.required, Validators.min(1)]],
    cliente: ['', [Validators.required, Validators.maxLength(100)]],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    dataVenda: [hoje(), Validators.required],
  });

  constructor() {
    this.carregar();
    this.carroService.listar().subscribe((lista) => this.carros.set(lista));
  }

  protected carregar(): void {
    this.vendaService.listar().subscribe({
      next: (lista) => this.vendas.set(lista),
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected nomeDoCarro(id: number): string {
    const carro = this.carros().find((c) => c.id === id);
    return carro ? `${carro.marca} ${carro.modelo}` : `#${id}`;
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = { ...this.form.getRawValue(), carroId: Number(this.form.getRawValue().carroId) };
    const emEdicao = this.editando();
    const pedido = emEdicao ? this.vendaService.atualizar(emEdicao.id, dados) : this.vendaService.criar(dados);
    pedido.subscribe({
      next: () => {
        this.avisos.sucesso(emEdicao ? 'Venda atualizada' : 'Venda cadastrada');
        this.cancelar();
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected editar(venda: Venda): void {
    this.editando.set(venda);
    this.form.setValue({ carroId: venda.carroId, cliente: venda.cliente, valor: venda.valor, dataVenda: venda.dataVenda });
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.form.reset({ carroId: 0, cliente: '', valor: 0, dataVenda: hoje() });
  }

  protected excluir(venda: Venda): void {
    if (!confirm(`Excluir a venda #${venda.id}?`)) {
      return;
    }
    this.vendaService.excluir(venda.id).subscribe({
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
