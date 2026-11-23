// src/screens/ResultadoLook.tsx
import React from 'react';
import type { ComponentProps } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Roupa } from '../types/Roupa';

type IconeNome = ComponentProps<typeof Ionicons>['name'];

interface Props {
  look: {
    superior: Roupa;
    inferior: Roupa;
    calcado: Roupa;
    acessorio: Roupa | null;
  };
  origem?: 'aleatorio' | 'manual' | 'repetido';
  aoMontarOutro: () => void;
  aoSalvarLook: () => void;
  aoFechar: () => void;
  aoEditarPeca?: (roupa: Roupa) => void;
}

export default function ResultadoLook({
  look,
  origem = 'aleatorio',
  aoMontarOutro,
  aoSalvarLook,
  aoFechar,
  aoEditarPeca,
}: Props) {
  const pecas: { label: string; roupa: Roupa; icone: IconeNome }[] = [
    { label: 'Parte Superior', roupa: look.superior, icone: 'shirt-outline' },
    { label: 'Parte Inferior', roupa: look.inferior, icone: 'walk-outline' },
    { label: 'Calçado', roupa: look.calcado, icone: 'footsteps-outline' },
  ];

  if (look.acessorio) {
    pecas.push({
      label: 'Acessório',
      roupa: look.acessorio,
      icone: 'watch-outline',
    });
  }

  const subtituloTexto =
    origem === 'manual'
      ? 'Escolhido por você'
      : origem === 'repetido'
      ? 'Um look que você já usou'
      : 'Uma combinação feita para você';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="sparkles" size={28} color="#4A90E2" />
          <Text style={styles.titulo}>Seu Look</Text>
          <Text style={styles.subtitulo}>{subtituloTexto}</Text>
        </View>

        <View style={styles.grid}>
          {pecas.map((peca, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => aoEditarPeca && aoEditarPeca(peca.roupa)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: peca.roupa.fotoUri }} style={styles.imagem} />
              <View style={styles.cardInfo}>
                <View style={styles.cardLabelContainer}>
                  <Ionicons name={peca.icone} size={16} color="#4A90E2" />
                  <Text style={styles.cardLabel}>{peca.label}</Text>
                </View>
                <Text style={styles.cardNome} numberOfLines={1}>
                  {peca.roupa.nome}
                </Text>
                <Text style={styles.cardCor}>{peca.roupa.cor}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={aoSalvarLook}>
          <Ionicons name="bookmark-outline" size={20} color="#4CAF50" />
          <Text style={styles.botaoSalvarTexto}>Salvar Look</Text>
        </TouchableOpacity>

        <View style={styles.acoes}>
          <TouchableOpacity style={styles.botaoSecundario} onPress={aoMontarOutro}>
            <Ionicons name="refresh-outline" size={20} color="#4A90E2" />
            <Text style={styles.botaoSecundarioTexto}>Montar Outro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoPrimario} onPress={aoFechar}>
            <Ionicons name="checkmark-outline" size={20} color="#fff" />
            <Text style={styles.botaoPrimarioTexto}>Concluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 8 },
  subtitulo: { fontSize: 14, color: '#888', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagem: { width: '100%', height: 160, resizeMode: 'cover' },
  cardInfo: { padding: 10 },
  cardLabelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardLabel: { fontSize: 11, color: '#4A90E2', fontWeight: '600', marginLeft: 4, textTransform: 'uppercase' },
  cardNome: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  cardCor: { fontSize: 12, color: '#777', marginTop: 2 },

  botaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
    gap: 8,
    marginTop: 10,
  },
  botaoSalvarTexto: { color: '#4CAF50', fontWeight: 'bold', fontSize: 16 },

  acoes: { flexDirection: 'row', gap: 12, marginTop: 12 },
  botaoSecundario: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    backgroundColor: '#fff',
    gap: 6,
  },
  botaoSecundarioTexto: { color: '#4A90E2', fontWeight: 'bold', fontSize: 15 },
  botaoPrimario: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    gap: 6,
  },
  botaoPrimarioTexto: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});