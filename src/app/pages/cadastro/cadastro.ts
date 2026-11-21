import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemDeErro } from '../../services/mensagem-erro';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly auth = inject(AuthService);
  private readonly avisos = inject(AvisoService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  protected readonly form = inject(NonNullableFormBuilder).group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.maxLength(20)],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.erro.set('');

    this.auth.cadastrar(this.form.getRawValue()).subscribe({
      next: (resposta) => {
        this.avisos.sucesso(`Bem-vindo, ${resposta.usuario.nome}!`);
        this.router.navigate(['/veiculos']);
      },
      error: (erro) => {
        this.erro.set(mensagemDeErro(erro));
        this.enviando.set(false);
      },
    });
  }
}
