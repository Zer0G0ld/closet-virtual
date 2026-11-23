// src/types/Roupa.ts
export interface Roupa {
  id: string;
  nome: string;
  fotoUri: string;
  categoria: 'parte_superior' | 'parte_inferior' | 'calcado' | 'acessorio';
  cor: string;
  estilo: string[];
  material?: string;
  tamanho?: string;
  preco?: number;
  marca?: string;
  modelo?: string;
  motivoDescarte?: string;
}