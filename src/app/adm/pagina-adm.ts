import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvisoService } from '../core/aviso.service';
import { mensagemDeErro } from '../core/mensagem-erro';
import { UsuarioService } from '../usuarios/usuario.service';
import { AdmService, Administrador } from './adm.service';

@Component({
  selector: 'app-pagina-adm',
  imports: [ReactiveFormsModule],
  templateUrl: './pagina-adm.html',
})
export class PaginaAdm {
  protected readonly usuarios = inject(UsuarioService);
  private readonly admService = inject(AdmService);
  private readonly avisos = inject(AvisoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly administradores = signal<Administrador[]>([]);
  protected readonly editando = signal<Administrador | null>(null);
  protected readonly logs = signal<string[] | null>(null);
  protected readonly buscandoLogs = signal(false);

  protected readonly form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.admService.listar().subscribe({
      next: (lista) => this.administradores.set(lista),
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected buscarLogs(): void {
    this.buscandoLogs.set(true);
    this.admService.logs(50).subscribe({
      next: (linhas) => {
        this.logs.set([...linhas].reverse());
        this.buscandoLogs.set(false);
      },
      error: (erro) => {
        this.buscandoLogs.set(false);
        this.avisos.erro(mensagemDeErro(erro));
      },
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dados = this.form.getRawValue();
    const emEdicao = this.editando();
    const pedido = emEdicao ? this.admService.atualizar(emEdicao.id, dados) : this.admService.criar(dados);
    pedido.subscribe({
      next: () => {
        this.avisos.sucesso(emEdicao ? 'Administrador atualizado' : 'Administrador cadastrado');
        this.cancelar();
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected editar(administrador: Administrador): void {
    this.editando.set(administrador);
    this.form.setValue({ nome: administrador.nome, email: administrador.email });
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.form.reset({ nome: '', email: '' });
  }

  protected excluir(administrador: Administrador): void {
    if (!confirm(`Excluir ${administrador.nome}?`)) {
      return;
    }
    this.admService.excluir(administrador.id).subscribe({
      next: () => {
        this.avisos.sucesso('Administrador excluído');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}
