import { Routes } from '@angular/router';
import { PaginaAdm } from './adm/pagina-adm';
import { PaginaAuditoria } from './auditoria/pagina-auditoria';
import { PaginaCarros } from './carros/pagina-carros';
import { PaginaContabilidade } from './contabilidade/pagina-contabilidade';
import { PaginaTestDrives } from './test-drives/pagina-test-drives';
import { PaginaUsuarios } from './usuarios/pagina-usuarios';
import { PaginaVendas } from './vendas/pagina-vendas';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
  { path: 'usuarios', component: PaginaUsuarios, title: 'Usuários - LojaCarro' },
  { path: 'carros', component: PaginaCarros, title: 'Carros - LojaCarro' },
  { path: 'vendas', component: PaginaVendas, title: 'Vendas - LojaCarro' },
  { path: 'test-drive', component: PaginaTestDrives, title: 'Test Drive - LojaCarro' },
  { path: 'contabilidade', component: PaginaContabilidade, title: 'Contabilidade - LojaCarro' },
  { path: 'adm', component: PaginaAdm, title: 'ADM - LojaCarro' },
  { path: 'auditoria', component: PaginaAuditoria, title: 'Auditoria - LojaCarro' },
  { path: '**', redirectTo: 'usuarios' },
];
