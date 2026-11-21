class ArmazenamentoDeTeste {
  private dados = new Map<string, string>();

  getItem(chave: string): string | null {
    return this.dados.get(chave) ?? null;
  }

  setItem(chave: string, valor: string): void {
    this.dados.set(chave, String(valor));
  }

  removeItem(chave: string): void {
    this.dados.delete(chave);
  }

  clear(): void {
    this.dados.clear();
  }
}

if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', { value: new ArmazenamentoDeTeste() });
}
