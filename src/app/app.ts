import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { AvisoService } from './services/aviso.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly avisos = inject(AvisoService);
  private readonly router = inject(Router);

  protected readonly menuAberto = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => this.menuAberto.set(false));
  }

  protected sair(): void {
    this.auth.sair();
    this.router.navigate(['/']);
  }
}
