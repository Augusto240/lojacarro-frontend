import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Carro } from '../carros/carro.model';
import { CarroService } from '../carros/carro.service';
import { AvisoService } from '../core/aviso.service';
import { mensagemDeErro } from '../core/mensagem-erro';
import { UsuarioService } from '../usuarios/usuario.service';
import { TestDrive, TestDriveService } from './test-drive.service';

@Component({
  selector: 'app-pagina-test-drives',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './pagina-test-drives.html',
})
export class PaginaTestDrives {
  protected readonly usuarios = inject(UsuarioService);
  private readonly testDriveService = inject(TestDriveService);
  private readonly carroService = inject(CarroService);
  private readonly avisos = inject(AvisoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly testDrives = signal<TestDrive[]>([]);
  protected readonly carros = signal<Carro[]>([]);
  protected readonly editando = signal<TestDrive | null>(null);

  protected readonly form = this.fb.group({
    carroId: [0, [Validators.required, Validators.min(1)]],
    cliente: ['', [Validators.required, Validators.maxLength(100)]],
    dataHora: ['', Validators.required],
    observacao: ['', Validators.maxLength(255)],
  });

  constructor() {
    this.carregar();
    this.carroService.listar().subscribe((lista) => this.carros.set(lista));
  }

  protected carregar(): void {
    this.testDriveService.listar().subscribe({
      next: (lista) => this.testDrives.set(lista),
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
    const valores = this.form.getRawValue();
    const dados = { ...valores, carroId: Number(valores.carroId), observacao: valores.observacao || null };
    const emEdicao = this.editando();
    const pedido = emEdicao ? this.testDriveService.atualizar(emEdicao.id, dados) : this.testDriveService.criar(dados);
    pedido.subscribe({
      next: () => {
        this.avisos.sucesso(emEdicao ? 'Test drive remarcado' : 'Test drive agendado');
        this.cancelar();
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected editar(testDrive: TestDrive): void {
    this.editando.set(testDrive);
    this.form.setValue({
      carroId: testDrive.carroId,
      cliente: testDrive.cliente,
      dataHora: testDrive.dataHora.slice(0, 16),
      observacao: testDrive.observacao ?? '',
    });
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.form.reset({ carroId: 0, cliente: '', dataHora: '', observacao: '' });
  }

  protected excluir(testDrive: TestDrive): void {
    if (!confirm(`Cancelar o test drive de ${testDrive.cliente}?`)) {
      return;
    }
    this.testDriveService.excluir(testDrive.id).subscribe({
      next: () => {
        this.avisos.sucesso('Test drive cancelado');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }
}
