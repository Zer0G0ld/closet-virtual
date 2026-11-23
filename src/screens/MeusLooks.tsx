// src/screens/MeusLooks.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Roupa } from '../types/Roupa';

export interface LookSalvo {
  id: string;
  data: string;
  pecas: {
    superior: Roupa;
    inferior: Roupa;
    calcado: Roupa;
    acessorio: Roupa | null;
  };
}

interface Props {
  looks: LookSalvo[];
  aoRepetir: (look: LookSalvo) => void;
  aoExcluir: (id: string) => void;
  aoVoltar: () => void;
}

export default function MeusLooks({ looks, aoRepetir, aoExcluir, aoVoltar }: Props) {
  const formatarData = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderLook = ({ item }: { item: LookSalvo }) => {
    const pecasArray = [
      { label: 'Sup.', roupa: item.pecas.superior },
      { label: 'Inf.', roupa: item.pecas.inferior },
      { label: 'Calç.', roupa: item.pecas.calcado },
    ];
    if (item.pecas.acessorio) {
      pecasArray.push({ label: 'Acess.', roupa: item.pecas.acessorio });
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dataContainer}>
            <Ionicons name="calendar-outline" size={16} color="#4A90E2" />
            <Text style={styles.dataTexto}>{formatarData(item.data)}</Text>
          </View>
          <TouchableOpacity onPress={() => aoExcluir(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>

        <View style={styles.pecasRow}>
          {pecasArray.map((p, i) => (
            <View key={i} style={styles.pecaItem}>
              <Image source={{ uri: p.roupa.fotoUri }} style={styles.pecaImagem} />
              <Text style={styles.pecaLabel}>{p.label}</Text>
              <Text style={styles.pecaNome} numberOfLines={1}>{p.roupa.nome}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.botaoRepetir} onPress={() => aoRepetir(item)}>
          <Ionicons name="refresh-outline" size={18} color="#fff" />
          <Text style={styles.botaoRepetirTexto}>Repetir Look</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={aoVoltar} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Meus Looks</Text>
        <View style={{ width: 24 }} />
      </View>

      {looks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="sparkles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum look salvo ainda.</Text>
          <Text style={styles.emptySubtext}>
            Monte um look e clique em "Salvar" para vê-lo aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={looks}
          keyExtractor={(item) => item.id}
          renderItem={renderLook}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  botaoVoltar: { padding: 4 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#888', marginTop: 8, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dataContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dataTexto: { fontSize: 13, color: '#4A90E2', fontWeight: '600' },
  pecasRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  pecaItem: { flex: 1, alignItems: 'center' },
  pecaImagem: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 4,
  },
  pecaLabel: { fontSize: 10, color: '#4A90E2', fontWeight: 'bold', textTransform: 'uppercase' },
  pecaNome: { fontSize: 11, color: '#333', textAlign: 'center' },
  botaoRepetir: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  botaoRepetirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});