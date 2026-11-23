// src/screens/Perfil.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Perfil as PerfilType } from '../types/Perfil';

interface Props {
  perfil: PerfilType | null;
  aoSalvar: (perfil: PerfilType) => void;
  aoVoltar: () => void;
  aoVerLooks: () => void;
  aoSalvarLookAtual?: () => void;
}

const CORES_AVATAR = [
  '#4A90E2', '#E91E63', '#4CAF50', '#FF9800',
  '#9C27B0', '#00BCD4', '#795548', '#607D8B',
];

const EMOJIS = ['👤', '😎', '👩', '👨', '🧑', '🌟', '🎨', '🦊'];

export default function Perfil({ perfil, aoSalvar, aoVoltar, aoVerLooks, aoSalvarLookAtual }: Props) {
  const [nome, setNome] = useState(perfil?.nome || '');
  const [corAvatar, setCorAvatar] = useState(perfil?.corAvatar || '#4A90E2');
  const [emoji, setEmoji] = useState(perfil?.emoji || '');
  const [modoAvatar, setModoAvatar] = useState<'inicial' | 'emoji'>(
    perfil?.avatar === 'emoji' ? 'emoji' : 'inicial'
  );

  const salvar = () => {
    if (!nome.trim()) {
      Alert.alert('Ops', 'Digite um nome para o seu perfil.');
      return;
    }
    aoSalvar({
      nome: nome.trim(),
      avatar: modoAvatar,
      corAvatar,
      emoji: modoAvatar === 'emoji' ? emoji : undefined,
    });
  };

  const inicial = nome.trim().charAt(0).toUpperCase() || '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={aoVoltar} style={styles.botaoVoltar}>
            <Ionicons name="chevron-back-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Meu Perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Prévia do avatar */}
        <View style={styles.previewContainer}>
          <View style={[styles.avatarGrande, { backgroundColor: corAvatar }]}>
            {modoAvatar === 'inicial' ? (
              <Text style={styles.avatarTexto}>{inicial}</Text>
            ) : (
              <Text style={styles.avatarEmoji}>{emoji || '👤'}</Text>
            )}
          </View>
          <Text style={styles.previewNome}>{nome || 'Seu nome'}</Text>
        </View>

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Como quer ser chamado?"
          placeholderTextColor="#999"
        />

        {/* Modo do avatar */}
        <Text style={styles.label}>Estilo do Avatar</Text>
        <View style={styles.modoContainer}>
          <TouchableOpacity
            style={[styles.modoBotao, modoAvatar === 'inicial' && styles.modoBotaoAtivo]}
            onPress={() => setModoAvatar('inicial')}
          >
            <Text style={[styles.modoTexto, modoAvatar === 'inicial' && styles.modoTextoAtivo]}>
              Inicial do nome
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modoBotao, modoAvatar === 'emoji' && styles.modoBotaoAtivo]}
            onPress={() => setModoAvatar('emoji')}
          >
            <Text style={[styles.modoTexto, modoAvatar === 'emoji' && styles.modoTextoAtivo]}>
              Emoji
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cores (só se for inicial) */}
        {modoAvatar === 'inicial' && (
          <>
            <Text style={styles.label}>Cor do Avatar</Text>
            <View style={styles.coresContainer}>
              {CORES_AVATAR.map((cor) => (
                <TouchableOpacity
                  key={cor}
                  style={[styles.corBotao, { backgroundColor: cor }, corAvatar === cor && styles.corBotaoAtiva]}
                  onPress={() => setCorAvatar(cor)}
                >
                  {corAvatar === cor && <Ionicons name="checkmark" size={18} color="#fff" />}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Emojis (só se for emoji) */}
        {modoAvatar === 'emoji' && (
          <>
            <Text style={styles.label}>Escolha um Emoji</Text>
            <View style={styles.emojisContainer}>
              {EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiBotao, emoji === e && styles.emojiBotaoAtivo]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={styles.emojiTexto}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Botão salvar perfil */}
        <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
          <Ionicons name="checkmark-outline" size={20} color="#fff" />
          <Text style={styles.botaoSalvarTexto}>Salvar Perfil</Text>
        </TouchableOpacity>

        {/* Botão salvar look atual (só aparece se houver look em memória) */}
        {aoSalvarLookAtual && (
          <TouchableOpacity style={styles.botaoSalvarLook} onPress={aoSalvarLookAtual}>
            <Ionicons name="bookmark-outline" size={20} color="#4CAF50" />
            <Text style={styles.botaoSalvarLookTexto}>Salvar Look Atual</Text>
          </TouchableOpacity>
        )}

        {/* Atalho para looks */}
        <TouchableOpacity style={styles.botaoLooks} onPress={aoVerLooks}>
          <Ionicons name="sparkles-outline" size={20} color="#4A90E2" />
          <Text style={styles.botaoLooksTexto}>Ver Meus Looks Salvos</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#4A90E2" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botaoVoltar: { padding: 4 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  previewContainer: { alignItems: 'center', marginBottom: 24 },
  avatarGrande: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  avatarEmoji: { fontSize: 48 },
  previewNome: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, marginTop: 14, color: '#444' },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modoContainer: { flexDirection: 'row', gap: 10 },
  modoBotao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modoBotaoAtivo: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  modoTexto: { color: '#555', fontWeight: '600' },
  modoTextoAtivo: { color: '#fff' },
  coresContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  corBotao: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  corBotaoAtiva: { borderColor: '#333' },
  emojisContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emojiBotao: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBotaoAtivo: { borderColor: '#4A90E2', backgroundColor: '#EAF2FD' },
  emojiTexto: { fontSize: 26 },
  botaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    gap: 8,
  },
  botaoSalvarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Botão "Salvar Look Atual" (NOVO)
  botaoSalvarLook: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    marginTop: 12,
    gap: 8,
  },
  botaoSalvarLookTexto: { color: '#4CAF50', fontWeight: 'bold', fontSize: 15 },

  botaoLooks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    marginTop: 12,
    gap: 8,
  },
  botaoLooksTexto: { color: '#4A90E2', fontWeight: 'bold', fontSize: 15 },
});