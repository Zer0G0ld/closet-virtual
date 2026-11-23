// src/types/Perfil.ts
export interface Perfil {
  nome: string;
  avatar: string; // 'inicial' | 'emoji' | 'cor'
  corAvatar: string; // hex
  emoji?: string; // se avatar = 'emoji'
}