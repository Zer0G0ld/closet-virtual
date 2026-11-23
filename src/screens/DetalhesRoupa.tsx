// src/screens/DetalhesRoupa.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Roupa } from '../types/Roupa';
import Ionicons from '@react-native-vector-icons/ionicons';

interface Props {
  roupa: Roupa;
  aoEditar: () => void;
  aoExcluir: () => void;
  aoVoltar: () => void;
}

export default function DetalhesRoupa({ roupa, aoEditar, aoExcluir, aoVoltar }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={aoVoltar} style={styles.botaoVoltar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-back-outline" size={22} color="#4A90E2" />
          <Text style={[styles.botaoVoltarTexto, { marginLeft: 4 }]}>Voltar</Text>
        </View>
      </TouchableOpacity>

      <Image source={{ uri: roupa.fotoUri }} style={styles.foto} />

      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{roupa.nome}</Text>
        <Text style={styles.categoria}>{roupa.categoria.replace('_', ' ')}</Text>

        <View style={styles.linha}><Text style={styles.label}>Cor:</Text><Text style={styles.valor}>{roupa.cor || '-'}</Text></View>
        <View style={styles.linha}><Text style={styles.label}>Marca:</Text><Text style={styles.valor}>{roupa.marca || '-'}</Text></View>
        <View style={styles.linha}><Text style={styles.label}>Modelo:</Text><Text style={styles.valor}>{roupa.modelo || '-'}</Text></View>
        <View style={styles.linha}><Text style={styles.label}>Material:</Text><Text style={styles.valor}>{roupa.material || '-'}</Text></View>
        <View style={styles.linha}><Text style={styles.label}>Tamanho:</Text><Text style={styles.valor}>{roupa.tamanho || '-'}</Text></View>
        <View style={styles.linha}><Text style={styles.label}>Preço:</Text><Text style={styles.valor}>{roupa.preco ? `R$ ${roupa.preco.toFixed(2)}` : '-'}</Text></View>

        <TouchableOpacity style={styles.botaoEditar} onPress={aoEditar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="pencil-outline" size={20} color="#fff" />
            <Text style={[styles.botaoEditarTexto, { marginLeft: 8 }]}>Editar Peça</Text>
          </View>
        </TouchableOpacity>

        {/* BOTÃO QUE ESTAVA FALTANDO */}
        <TouchableOpacity style={styles.botaoExcluir} onPress={aoExcluir}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="trash-outline" size={20} color="#E53935" />
            <Text style={[styles.botaoExcluirTexto, { marginLeft: 8 }]}>
              Remover do Armário
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  botaoVoltar: { padding: 20, paddingBottom: 10 },
  botaoVoltarTexto: { fontSize: 16, color: '#4A90E2', fontWeight: 'bold' },
  foto: { width: '100%', height: 350, resizeMode: 'cover' },
  infoContainer: { padding: 20 },
  nome: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  categoria: { fontSize: 14, color: '#888', marginBottom: 20, textTransform: 'capitalize' },
  linha: { flexDirection: 'row', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#555', width: 80 },
  valor: { fontSize: 16, color: '#333', flex: 1 },
  botaoEditar: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  botaoEditarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoExcluir: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E53935',
    marginTop: 12,
    backgroundColor: '#fff',
  },
  botaoExcluirTexto: { color: '#E53935', fontSize: 15, fontWeight: 'bold' },
});