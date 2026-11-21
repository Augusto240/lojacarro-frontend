import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-painel',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './painel.html',
})
export class Painel {
  protected readonly auth = inject(AuthService);
}
