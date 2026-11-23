// src/screens/AdicionarRoupa.tsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Roupa } from '../types/Roupa';

interface Props {
  aoSalvar: (roupa: Roupa) => void;
  aoCancelar: () => void;
  roupaEmEdicao?: Roupa | null; // Nova prop opcional
}

export default function AdicionarRoupa({ aoSalvar, aoCancelar, roupaEmEdicao }: Props) {
  // Inicializa os estados com os dados da roupa se estiver editando
  const [fotoUri, setFotoUri] = useState<string | null>(roupaEmEdicao?.fotoUri || null);
  const [nome, setNome] = useState(roupaEmEdicao?.nome || '');
  const [cor, setCor] = useState(roupaEmEdicao?.cor || '');
  const [material, setMaterial] = useState(roupaEmEdicao?.material || '');
  const [tamanho, setTamanho] = useState(roupaEmEdicao?.tamanho || '');
  const [marca, setMarca] = useState(roupaEmEdicao?.marca || '');
  const [modelo, setModelo] = useState(roupaEmEdicao?.modelo || '');
  const [preco, setPreco] = useState(roupaEmEdicao?.preco?.toString() || '');
  const [categoria, setCategoria] = useState<Roupa['categoria']>(roupaEmEdicao?.categoria || 'parte_superior');

  // Função para tirar foto (mantida igual)
  const abrirCamera = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Aviso', 'Precisamos de permissão para usar a câmera!');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [3, 4], quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  // Função para escolher da galeria (mantida igual)
  const abrirGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Aviso', 'Precisamos de permissão para acessar suas fotos!');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [3, 4], quality: 0.7,
    });
    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const salvar = () => {
    if (!nome.trim()) {
      Alert.alert('Ops', 'Dê um nome para a peça!');
      return;
    }
    if (!fotoUri) {
      Alert.alert('Ops', 'Escolha uma foto para a peça!');
      return;
    }

    const roupaSalva: Roupa = {
      id: roupaEmEdicao ? roupaEmEdicao.id : String(Date.now()), // Mantém o ID se estiver editando
      nome,
      fotoUri,
      categoria,
      cor,
      material,
      tamanho,
      marca,
      modelo,
      preco: preco ? parseFloat(preco.replace(',', '.')) : undefined,
      estilo: roupaEmEdicao?.estilo || [], // Mantém estilos existentes ou cria vazio
    };

    aoSalvar(roupaSalva);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.titulo}>{roupaEmEdicao ? 'Editar Peça' : 'Nova Peça'}</Text>

        <View style={styles.fotoContainer}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.fotoTexto}>Nenhuma foto selecionada</Text>
            </View>
          )}
        </View>

        <View style={styles.botoesFoto}>
            <TouchableOpacity style={styles.botaoCamera} onPress={abrirCamera}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
                <Text style={styles.botaoTexto}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoGaleria} onPress={abrirGaleria}>
                <Ionicons name="images-outline" size={20} color="#fff" />
                <Text style={styles.botaoTexto}>Galeria</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nome da Peça *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Camisa Social Azul" />

        <Text style={styles.label}>Cor</Text>
        <TextInput style={styles.input} value={cor} onChangeText={setCor} placeholder="Ex: Azul Escuro" />

        <Text style={styles.label}>Marca</Text>
        <TextInput style={styles.input} value={marca} onChangeText={setMarca} placeholder="Ex: Zara" />

        <Text style={styles.label}>Modelo</Text>
        <TextInput style={styles.input} value={modelo} onChangeText={setModelo} placeholder="Ex: Slim Fit" />

        <Text style={styles.label}>Material</Text>
        <TextInput style={styles.input} value={material} onChangeText={setMaterial} placeholder="Ex: Algodão" />

        <Text style={styles.label}>Tamanho</Text>
        <TextInput style={styles.input} value={tamanho} onChangeText={setTamanho} placeholder="Ex: M, 42" />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput 
          style={styles.input} 
          value={preco} 
          onChangeText={setPreco} 
          placeholder="Ex: 89.90" 
          keyboardType="numeric" 
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriasContainer}>
          {['parte_superior', 'parte_inferior', 'calcado', 'acessorio'].map((cat) => (
            <TouchableOpacity 
              key={cat}
              style={[styles.categoriaBotao, categoria === cat && styles.categoriaBotaoAtivo]}
              onPress={() => setCategoria(cat as Roupa['categoria'])}
            >
              <Text style={categoria === cat ? styles.categoriaTextoAtivo : styles.categoriaTexto}>
                {cat.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.acoesContainer}>
          <TouchableOpacity style={styles.botaoCancelar} onPress={aoCancelar}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
            <Text style={styles.botaoSalvarTexto}>{roupaEmEdicao ? 'Salvar Alterações' : 'Salvar no Armário'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ... (mantenha os mesmos estilos que você já tinha, adicionando nada novo é necessário, pois os campos usam o mesmo estilo input)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  fotoContainer: { alignItems: 'center', marginBottom: 15 },
  fotoPreview: { width: 200, height: 266, borderRadius: 10 },
  fotoPlaceholder: { width: 200, height: 266, borderRadius: 10, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  fotoTexto: { color: '#888' },
  botoesFoto: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, gap: 10 },
botaoCamera: {
  backgroundColor: '#4A90E2',
  padding: 12,
  borderRadius: 8,
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
},
botaoGaleria: {
  backgroundColor: '#50E3C2',
  padding: 12,
  borderRadius: 8,
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
},
botaoTexto: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, marginTop: 10, color: '#444' },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  categoriasContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  categoriaBotao: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  categoriaBotaoAtivo: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  categoriaTexto: { color: '#555', textTransform: 'capitalize' },
  categoriaTextoAtivo: { color: '#fff', fontWeight: 'bold' },
  acoesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  botaoCancelar: { padding: 15, borderRadius: 8, flex: 1, marginRight: 10, backgroundColor: '#f0f0f0', alignItems: 'center' },
  botaoCancelarTexto: { color: '#555', fontWeight: 'bold' },
  botaoSalvar: { padding: 15, borderRadius: 8, flex: 2, backgroundColor: '#4A90E2', alignItems: 'center' },
  botaoSalvarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});