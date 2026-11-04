import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_LOJA } from '../core/api';
import { CrudApi } from '../core/crud-api';
import { LogService } from '../core/log.service';

export interface TestDrive {
  id: number;
  carroId: number;
  cliente: string;
  dataHora: string;
  observacao: string | null;
}

export type DadosTestDrive = Omit<TestDrive, 'id'>;

@Injectable({ providedIn: 'root' })
export class TestDriveService extends CrudApi<TestDrive, DadosTestDrive> {
  constructor() {
    super(inject(HttpClient), inject(LogService), `${API_LOJA}/test-drives`, 'test drive');
  }
}
