import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvisoService } from '../core/aviso.service';
import { mensagemDeErro } from '../core/mensagem-erro';
import { UsuarioService } from '../usuarios/usuario.service';
import { Lancamento, LancamentoService, TipoLancamento } from './lancamento.service';

@Component({
  selector: 'app-pagina-contabilidade',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './pagina-contabilidade.html',
})
export class PaginaContabilidade {
  protected readonly usuarios = inject(UsuarioService);
  private readonly lancamentoService = inject(LancamentoService);
  private readonly avisos = inject(AvisoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly lancamentos = signal<Lancamento[]>([]);
  protected readonly editando = signal<Lancamento | null>(null);
  protected readonly saldo = computed(() =>
    this.lancamentos().reduce((total, l) => total + (l.tipo === 'RECEITA' ? l.valor : -l.valor), 0),
  );

  protected readonly form = this.fb.group({
    descricao: ['', [Validators.required, Validators.maxLength(150)]],
    tipo: this.fb.control<TipoLancamento>('RECEITA'),
    valor: [0, [Validators.required, Validators.min(0.01)]],
    data: [new Date().toISOString().slice(0, 10), Validators.required],
  });

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.lancamentoService.listar().subscribe({
      next: (lista) => this.lancamentos.set(lista),
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    const emEdicao = this.editando();
    const pedido = emEdicao ? this.lancamentoService.atualizar(emEdicao.id, dados) : this.lancamentoService.criar(dados);
    pedido.subscribe({
      next: () => {
        this.avisos.sucesso(emEdicao ? 'Lançamento atualizado' : 'Lançamento registrado');
        this.cancelar();
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected editar(lancamento: Lancamento): void {
    this.editando.set(lancamento);
    this.form.setValue({
      descricao: lancamento.descricao,
      tipo: lancamento.tipo,
      valor: lancamento.valor,
      data: lancamento.data,
    });
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.form.reset({ descricao: '', tipo: 'RECEITA', valor: 0, data: new Date().toISOString().slice(0, 10) });
  }

  protected excluir(lancamento: Lancamento): void {
    if (!confirm(`Excluir "${lancamento.descricao}"?`)) {
      return;
    }
    this.lancamentoService.excluir(lancamento.id).subscribe({
      next: () => {
        this.avisos.sucesso('Lançamento excluído');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}
