import { Component, input } from '@angular/core';

@Component({
  selector: 'app-carregando',
  template: `<div class="carregando">{{ texto() }}</div>`,
})
export class Carregando {
  readonly texto = input('Carregando...');
}
