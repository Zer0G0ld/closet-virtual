// src/screens/ExcluirRoupa.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Roupa } from '../types/Roupa';

interface Props {
  roupa: Roupa;
  aoConfirmar: (motivo: string) => void;
  aoCancelar: () => void;
}

const MOTIVOS = [
  { id: 'doar', label: 'Vou doar', icone: 'heart-outline' as const, cor: '#E91E63' },
  { id: 'vender', label: 'Vou vender', icone: 'cash-outline' as const, cor: '#4CAF50' },
  { id: 'nao_cabe', label: 'Não cabe mais', icone: 'resize-outline' as const, cor: '#FF9800' },
  { id: 'nao_serve', label: 'Não serve / não gosto', icone: 'close-circle-outline' as const, cor: '#9C27B0' },
  { id: 'ruim', label: 'Está ruim / desgastada', icone: 'alert-circle-outline' as const, cor: '#F44336' },
  { id: 'rasgado', label: 'Está rasgada', icone: 'cut-outline' as const, cor: '#795548' },
  { id: 'outro', label: 'Outro motivo', icone: 'ellipsis-horizontal-outline' as const, cor: '#607D8B' },
];

export default function ExcluirRoupa({ roupa, aoConfirmar, aoCancelar }: Props) {
  const [motivoSelecionado, setMotivoSelecionado] = useState<string | null>(null);

  const confirmar = () => {
    if (!motivoSelecionado) {
      Alert.alert('Atenção', 'Selecione um motivo para remover a peça.');
      return;
    }
    Alert.alert(
      'Remover peça?',
      `"${roupa.nome}" será removida do seu armário. Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => aoConfirmar(motivoSelecionado),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={aoCancelar} style={styles.botaoVoltar}>
            <Ionicons name="chevron-back-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Remover Peça</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Prévia da peça */}
        <View style={styles.previewContainer}>
          <Image source={{ uri: roupa.fotoUri }} style={styles.previewImagem} />
          <Text style={styles.previewNome}>{roupa.nome}</Text>
          <Text style={styles.previewInfo}>
            {roupa.categoria.replace('_', ' ')} • {roupa.cor}
          </Text>
        </View>

        {/* Pergunta */}
        <View style={styles.perguntaContainer}>
          <Ionicons name="help-circle-outline" size={22} color="#4A90E2" />
          <Text style={styles.pergunta}>
            Por que você está removendo esta peça?
          </Text>
        </View>

        {/* Motivos */}
        <View style={styles.motivosContainer}>
          {MOTIVOS.map((motivo) => {
            const selecionado = motivoSelecionado === motivo.id;
            return (
              <TouchableOpacity
                key={motivo.id}
                style={[
                  styles.motivoBotao,
                  selecionado && styles.motivoBotaoSelecionado,
                ]}
                onPress={() => setMotivoSelecionado(motivo.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.motivoIcone,
                    { backgroundColor: selecionado ? motivo.cor : '#f0f0f0' },
                  ]}
                >
                  <Ionicons
                    name={motivo.icone}
                    size={20}
                    color={selecionado ? '#fff' : motivo.cor}
                  />
                </View>
                <Text
                  style={[
                    styles.motivoTexto,
                    selecionado && styles.motivoTextoSelecionado,
                  ]}
                >
                  {motivo.label}
                </Text>
                {selecionado && (
                  <Ionicons name="checkmark-circle" size={22} color={motivo.cor} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botões de ação */}
        <View style={styles.acoes}>
          <TouchableOpacity style={styles.botaoCancelar} onPress={aoCancelar}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botaoRemover,
              !motivoSelecionado && styles.botaoRemoverDesabilitado,
            ]}
            onPress={confirmar}
            disabled={!motivoSelecionado}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.botaoRemoverTexto}>Remover do Armário</Text>
          </TouchableOpacity>
        </View>
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
  previewImagem: { width: 140, height: 180, borderRadius: 12 },
  previewNome: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  previewInfo: { fontSize: 13, color: '#888', marginTop: 2, textTransform: 'capitalize' },
  perguntaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pergunta: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
  motivosContainer: { gap: 10, marginBottom: 30 },
  motivoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  motivoBotaoSelecionado: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F6FF',
  },
  motivoIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  motivoTexto: { flex: 1, fontSize: 15, color: '#555', fontWeight: '500' },
  motivoTextoSelecionado: { color: '#333', fontWeight: 'bold' },
  acoes: { flexDirection: 'row', gap: 12 },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  botaoCancelarTexto: { color: '#555', fontWeight: 'bold', fontSize: 15 },
  botaoRemover: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#E53935',
    gap: 8,
  },
  botaoRemoverDesabilitado: { backgroundColor: '#f0a0a0' },
  botaoRemoverTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});