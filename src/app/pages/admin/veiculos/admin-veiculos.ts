import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { enderecoDaImagem } from '../../../api';
import { Carregando } from '../../../components/carregando/carregando';
import {
  COMBUSTIVEIS,
  Combustivel,
  SITUACOES_VEICULO,
  SituacaoVeiculo,
  TRANSMISSOES,
  Transmissao,
  Veiculo,
} from '../../../models/veiculo';
import { AvisoService } from '../../../services/aviso.service';
import { mensagemDeErro } from '../../../services/mensagem-erro';
import { VeiculoService } from '../../../services/veiculo.service';

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

@Component({
  selector: 'app-admin-veiculos',
  imports: [ReactiveFormsModule, FormsModule, CurrencyPipe, Carregando],
  templateUrl: './admin-veiculos.html',
})
export class AdminVeiculos {
  private readonly veiculoService = inject(VeiculoService);
  private readonly avisos = inject(AvisoService);

  protected readonly veiculos = signal<Veiculo[]>([]);
  protected readonly carregando = signal(true);
  protected readonly formularioAberto = signal(false);
  protected readonly editando = signal<Veiculo | null>(null);
  protected readonly salvando = signal(false);
  protected readonly foto = signal<File | null>(null);
  protected readonly previa = signal<string | null>(null);
  protected readonly erroFoto = signal('');

  protected situacao: SituacaoVeiculo | '' = '';
  protected busca = '';

  protected readonly combustiveis = Object.entries(COMBUSTIVEIS);
  protected readonly transmissoes = Object.entries(TRANSMISSOES);
  protected readonly situacoes = SITUACOES_VEICULO;
  protected readonly enderecoDaImagem = enderecoDaImagem;

  protected readonly form = inject(NonNullableFormBuilder).group({
    marca: ['', [Validators.required, Validators.maxLength(60)]],
    modelo: ['', [Validators.required, Validators.maxLength(80)]],
    anoFabricacao: [new Date().getFullYear(), [Validators.required, Validators.min(1950)]],
    anoModelo: [new Date().getFullYear(), [Validators.required, Validators.min(1950)]],
    cor: ['', [Validators.required, Validators.maxLength(40)]],
    quilometragem: [0, [Validators.required, Validators.min(0)]],
    combustivel: ['FLEX' as Combustivel, Validators.required],
    transmissao: ['MANUAL' as Transmissao, Validators.required],
    preco: [0, [Validators.required, Validators.min(1)]],
    descricao: ['', Validators.maxLength(1000)],
  });

  constructor() {
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.veiculoService.listarTodos({ situacao: this.situacao, busca: this.busca }).subscribe({
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

  protected novo(): void {
    this.editando.set(null);
    this.form.reset();
    this.limparFoto();
    this.formularioAberto.set(true);
  }

  protected editar(veiculo: Veiculo): void {
    this.editando.set(veiculo);
    this.form.setValue({
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      anoFabricacao: veiculo.anoFabricacao,
      anoModelo: veiculo.anoModelo,
      cor: veiculo.cor,
      quilometragem: veiculo.quilometragem,
      combustivel: veiculo.combustivel,
      transmissao: veiculo.transmissao,
      preco: veiculo.preco,
      descricao: veiculo.descricao ?? '',
    });
    this.limparFoto();
    this.formularioAberto.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected fechar(): void {
    this.formularioAberto.set(false);
    this.editando.set(null);
    this.limparFoto();
  }

  protected escolherFoto(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const arquivo = campo.files?.[0] ?? null;
    campo.value = '';
    this.erroFoto.set('');

    if (!arquivo) {
      return;
    }
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      this.erroFoto.set('Use uma imagem JPG, PNG ou WebP.');
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      this.erroFoto.set('A foto pode ter no máximo 5 MB.');
      return;
    }

    const veiculo = this.editando();
    if (veiculo) {
      this.enviarFotoExtra(veiculo, arquivo);
      return;
    }
    this.foto.set(arquivo);
    this.previa.set(URL.createObjectURL(arquivo));
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const veiculo = this.editando();
    const foto = this.foto();
    if (!veiculo && !foto) {
      this.erroFoto.set('A foto é obrigatória.');
      return;
    }

    this.salvando.set(true);
    const dados = this.form.getRawValue();
    const pedido = veiculo ? this.veiculoService.atualizar(veiculo.id, dados) : this.veiculoService.cadastrar(dados, foto!);

    pedido.subscribe({
      next: () => {
        this.avisos.sucesso(veiculo ? 'Veículo atualizado' : 'Veículo cadastrado');
        this.salvando.set(false);
        this.fechar();
        this.carregar();
      },
      error: (erro) => {
        this.avisos.erro(mensagemDeErro(erro));
        this.salvando.set(false);
      },
    });
  }

  protected removerFoto(veiculo: Veiculo, fotoId: number): void {
    this.veiculoService.removerFoto(veiculo.id, fotoId).subscribe({
      next: (atualizado) => {
        this.editando.set(atualizado);
        this.avisos.sucesso('Foto removida');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  protected marcarVendido(veiculo: Veiculo): void {
    if (confirm(`Marcar o ${veiculo.marca} ${veiculo.modelo} como vendido? Os test drives futuros serão cancelados.`)) {
      this.veiculoService.marcarVendido(veiculo.id).subscribe(this.depoisDeMudar('Veículo marcado como vendido'));
    }
  }

  protected desativar(veiculo: Veiculo): void {
    if (confirm(`Tirar o ${veiculo.marca} ${veiculo.modelo} do catálogo?`)) {
      this.veiculoService.desativar(veiculo.id).subscribe(this.depoisDeMudar('Veículo desativado'));
    }
  }

  protected reativar(veiculo: Veiculo): void {
    this.veiculoService.reativar(veiculo.id).subscribe(this.depoisDeMudar('Veículo de volta ao catálogo'));
  }

  private enviarFotoExtra(veiculo: Veiculo, arquivo: File): void {
    this.veiculoService.adicionarFoto(veiculo.id, arquivo).subscribe({
      next: (atualizado) => {
        this.editando.set(atualizado);
        this.avisos.sucesso('Foto adicionada');
        this.carregar();
      },
      error: (erro) => this.avisos.erro(mensagemDeErro(erro)),
    });
  }

  private depoisDeMudar(mensagem: string) {
    return {
      next: () => {
        this.avisos.sucesso(mensagem);
        this.carregar();
      },
      error: (erro: unknown) => this.avisos.erro(mensagemDeErro(erro)),
    };
  }

  private limparFoto(): void {
    this.foto.set(null);
    this.previa.set(null);
    this.erroFoto.set('');
  }
}
