// src/components/ModalMotivo.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface Props {
  visivel: boolean;
  quantidade: number;
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

export default function ModalMotivo({
  visivel,
  quantidade,
  aoConfirmar,
  aoCancelar,
}: Props) {
    const [motivoSelecionado, setMotivoSelecionado] = useState<string | null>(null);
    
    React.useEffect(() => {
        if (!visivel) setMotivoSelecionado(null);
    }, [visivel]);

  const confirmar = () => {
    if (!motivoSelecionado) return;
    aoConfirmar(motivoSelecionado);
    setMotivoSelecionado(null);
  };

  const cancelar = () => {
    setMotivoSelecionado(null);
    aoCancelar();
  };

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={cancelar}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Remover {quantidade} peça{quantidade > 1 ? 's' : ''}</Text>
            <TouchableOpacity onPress={cancelar}>
              <Ionicons name="close-outline" size={26} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.pergunta}>Por que você está removendo?</Text>

          <ScrollView style={{ maxHeight: 360 }}>
            {MOTIVOS.map((motivo) => {
              const sel = motivoSelecionado === motivo.id;
              return (
                <TouchableOpacity
                  key={motivo.id}
                  style={[styles.motivo, sel && styles.motivoSel]}
                  onPress={() => setMotivoSelecionado(motivo.id)}
                >
                  <View style={[styles.icone, { backgroundColor: sel ? motivo.cor : '#f0f0f0' }]}>
                    <Ionicons name={motivo.icone} size={18} color={sel ? '#fff' : motivo.cor} />
                  </View>
                  <Text style={[styles.motivoTexto, sel && { fontWeight: 'bold', color: '#333' }]}>
                    {motivo.label}
                  </Text>
                  {sel && <Ionicons name="checkmark-circle" size={20} color={motivo.cor} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.acoes}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={cancelar}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoExcluir, !motivoSelecionado && { backgroundColor: '#f0a0a0' }]}
              onPress={confirmar}
              disabled={!motivoSelecionado}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.botaoExcluirTexto}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  pergunta: { fontSize: 15, color: '#666', marginBottom: 14 },
  motivo: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 8, backgroundColor: '#fafafa' },
  motivoSel: { borderColor: '#4A90E2', backgroundColor: '#F0F6FF' },
  icone: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  motivoTexto: { flex: 1, fontSize: 15, color: '#555' },
  acoes: { flexDirection: 'row', gap: 10, marginTop: 14 },
  botaoCancelar: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  botaoCancelarTexto: { color: '#555', fontWeight: 'bold' },
  botaoExcluir: { flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 10, backgroundColor: '#E53935', gap: 6 },
  botaoExcluirTexto: { color: '#fff', fontWeight: 'bold' },
});