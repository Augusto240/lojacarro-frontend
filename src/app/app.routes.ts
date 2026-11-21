import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { AdminAdministradores } from './pages/admin/administradores/admin-administradores';
import { AdminAgendamentos } from './pages/admin/agendamentos/admin-agendamentos';
import { AdminContabilidade } from './pages/admin/contabilidade/admin-contabilidade';
import { Painel } from './pages/admin/painel/painel';
import { AdminVeiculos } from './pages/admin/veiculos/admin-veiculos';
import { AdminVendas } from './pages/admin/vendas/admin-vendas';
import { VisaoGeral } from './pages/admin/visao-geral/visao-geral';
import { Agendar } from './pages/agendar/agendar';
import { Cadastro } from './pages/cadastro/cadastro';
import { Catalogo } from './pages/catalogo/catalogo';
import { Detalhes } from './pages/detalhes/detalhes';
import { Inicio } from './pages/inicio/inicio';
import { Login } from './pages/login/login';
import { MeusAgendamentos } from './pages/meus-agendamentos/meus-agendamentos';

export const routes: Routes = [
  { path: '', component: Inicio, title: 'LojaCarro' },
  { path: 'veiculos', component: Catalogo, title: 'Catálogo - LojaCarro' },
  { path: 'veiculos/:id', component: Detalhes, title: 'Veículo - LojaCarro' },
  { path: 'veiculos/:id/agendar', component: Agendar, canActivate: [authGuard], title: 'Agendar - LojaCarro' },
  { path: 'login', component: Login, title: 'Entrar - LojaCarro' },
  { path: 'cadastro', component: Cadastro, title: 'Criar conta - LojaCarro' },
  {
    path: 'meus-agendamentos',
    component: MeusAgendamentos,
    canActivate: [authGuard],
    title: 'Meus test drives - LojaCarro',
  },
  {
    path: 'admin',
    component: Painel,
    canActivate: [adminGuard],
    children: [
      { path: '', component: VisaoGeral, title: 'Painel - LojaCarro' },
      { path: 'veiculos', component: AdminVeiculos, title: 'Veículos - LojaCarro' },
      { path: 'agendamentos', component: AdminAgendamentos, title: 'Agendamentos - LojaCarro' },
      { path: 'vendas', component: AdminVendas, title: 'Vendas - LojaCarro' },
      { path: 'contabilidade', component: AdminContabilidade, title: 'Contabilidade - LojaCarro' },
      { path: 'administradores', component: AdminAdministradores, title: 'Administradores - LojaCarro' },
    ],
  },
  { path: '**', redirectTo: '' },
];
