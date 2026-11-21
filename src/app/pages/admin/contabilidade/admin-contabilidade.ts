import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carregando } from '../../../components/carregando/carregando';
import { Lancamento, TipoLancamento } from '../../../models/bonus';
import { AvisoService } from '../../../services/aviso.service';
import { BonusService } from '../../../services/bonus.service';
import { mensagemDeErro } from '../../../services/mensagem-erro';

@Component({
  selector: 'app-admin-contabilidade',
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, Carregando],
  templateUrl: './admin-contabilidade.html',
})
export class AdminContabilidade {
  private readonly bonus = inject(BonusService);
  private readonly avisos = inject(AvisoService);

  protected readonly lancamentos = signal<Lancamento[]>([]);
  protected readonly carregando = signal(true);
  protected readonly editando = signal<Lancamento | null>(null);

  protected readonly saldo = computed(() =>
    this.lancamentos().reduce((total, item) => total + (item.tipo === 'RECEITA' ? item.valor : -item.valor), 0),
  );

  protected readonly form = inject(NonNullableFormBuilder).group({
    descricao: ['', [Validators.required, Validators.maxLength(150)]],
    tipo: ['RECEITA' as TipoLancamento, Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    data: [hoje(), Validators.required],
  });

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.bonus.listarLancamentos().subscribe({
      next: (lista) => {
        this.lancamentos.set(lista);
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
    this.bonus.salvarLancamento(this.form.getRawValue(), this.editando()?.id).subscribe({
      next: () => {
        this.avisos.sucesso('Lançamento salvo');
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
    this.form.reset({ descricao: '', tipo: 'RECEITA', valor: 0, data: hoje() });
  }

  protected excluir(lancamento: Lancamento): void {
    if (!confirm(`Excluir "${lancamento.descricao}"?`)) {
      return;
    }
    this.bonus.excluirLancamento(lancamento.id).subscribe({
      next: () => {
        this.avisos.sucesso('Lançamento excluído');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}
