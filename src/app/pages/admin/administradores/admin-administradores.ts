import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carregando } from '../../../components/carregando/carregando';
import { Usuario } from '../../../models/usuario';
import { AuthService } from '../../../services/auth.service';
import { AvisoService } from '../../../services/aviso.service';
import { BonusService } from '../../../services/bonus.service';
import { mensagemDeErro } from '../../../services/mensagem-erro';

@Component({
  selector: 'app-admin-administradores',
  imports: [ReactiveFormsModule, Carregando],
  templateUrl: './admin-administradores.html',
})
export class AdminAdministradores {
  protected readonly auth = inject(AuthService);
  private readonly bonus = inject(BonusService);
  private readonly avisos = inject(AvisoService);

  protected readonly administradores = signal<Usuario[]>([]);
  protected readonly logs = signal<string[] | null>(null);
  protected readonly buscandoLogs = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.bonus.listarAdministradores().subscribe((lista) => this.administradores.set(lista));
  }

  protected criar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.bonus.criarAdministrador(this.form.getRawValue()).subscribe({
      next: () => {
        this.avisos.sucesso('Administrador criado');
        this.form.reset();
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected excluir(administrador: Usuario): void {
    if (!confirm(`Excluir o administrador ${administrador.nome}?`)) {
      return;
    }
    this.bonus.excluirAdministrador(administrador.id).subscribe({
      next: () => {
        this.avisos.sucesso('Administrador excluído');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected verLogs(): void {
    this.buscandoLogs.set(true);
    this.bonus.ultimosLogs().subscribe({
      next: (linhas) => {
        this.logs.set(linhas);
        this.buscandoLogs.set(false);
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.buscandoLogs.set(false);
      },
    });
  }
}
