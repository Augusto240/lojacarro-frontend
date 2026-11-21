import { HttpErrorResponse } from '@angular/common/http';

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof HttpErrorResponse) {
    if (erro.status === 0) {
      return 'Não foi possível falar com o servidor. Ele está ligado?';
    }
    if (erro.error?.error) {
      return erro.error.error;
    }
  }
  return 'Algo deu errado. Tente de novo.';
}
