// App.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Roupa } from './src/types/Roupa';
import Ionicons from '@react-native-vector-icons/ionicons';
import AdicionarRoupa from './src/screens/AdicionarRoupa';
import DetalhesRoupa from './src/screens/DetalhesRoupa';
import MontandoLook from './src/screens/MontandoLook';
import ResultadoLook from './src/screens/ResultadoLook';
import ExcluirRoupa from './src/screens/ExcluirRoupa';
import ModalMotivo from './src/components/ModalMotivo';
import Perfil from './src/screens/Perfil';
import MeusLooks, { LookSalvo } from './src/screens/MeusLooks';
import { Perfil as PerfilType } from './src/types/Perfil';

type Tela =
  | 'armario'
  | 'adicionar'
  | 'detalhes'
  | 'editar'
  | 'montando'
  | 'resultado'
  | 'excluir'
  | 'perfil'
  | 'meusLooks';

interface Look {
  superior: Roupa;
  inferior: Roupa;
  calcado: Roupa;
  acessorio: Roupa | null;
}

export default function App() {
  const [roupas, setRoupas] = useState<Roupa[]>([]);
  const [telaAtual, setTelaAtual] = useState<Tela>('armario');
  const [roupaSelecionada, setRoupaSelecionada] = useState<Roupa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [menuAberto, setMenuAberto] = useState(false);
  const [lookAtual, setLookAtual] = useState<Look | null>(null);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [modalMotivoAberto, setModalMotivoAberto] = useState(false);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [looksSalvos, setLooksSalvos] = useState<LookSalvo[]>([]);
  const [lookJaSalvo, setLookJaSalvo] = useState(false);
  const [origemLook, setOrigemLook] = useState<'aleatorio' | 'manual' | 'repetido'>('aleatorio');

  useEffect(() => {
    carregarRoupas();
    carregarPerfil();
    carregarLooks();
  }, []);

  useEffect(() => {
    if (telaAtual === 'meusLooks') {
      carregarLooks();
    }
  }, [telaAtual]);

  const carregarPerfil = async () => {
    try {
      const salvo = await AsyncStorage.getItem('@closet_perfil');
      if (salvo) setPerfil(JSON.parse(salvo));
    } catch (e) {
      console.error(e);
    }
  };

  const carregarLooks = async () => {
    try {
      const salvo = await AsyncStorage.getItem('@closet_looks');
      console.log('📦 carregarLooks:', salvo);
      if (salvo) setLooksSalvos(JSON.parse(salvo));
    } catch (e) {
      console.error(e);
    }
  };

  const salvarPerfil = async (novoPerfil: PerfilType) => {
    setPerfil(novoPerfil);
    await AsyncStorage.setItem('@closet_perfil', JSON.stringify(novoPerfil));
    setTelaAtual('armario');
  };

  const salvarLookAtual = async () => {
    console.log('🔵 salvarLookAtual chamada');
    if (!lookAtual) {
      console.log('❌ lookAtual é null');
      return;
    }
    const novoLookSalvo: LookSalvo = {
      id: String(Date.now()),
      data: new Date().toISOString(),
      pecas: lookAtual,
    };
    console.log('🟢 Salvando look:', novoLookSalvo);
    const listaAtualizada = [novoLookSalvo, ...looksSalvos];
    setLooksSalvos(listaAtualizada);
    await AsyncStorage.setItem('@closet_looks', JSON.stringify(listaAtualizada));
    console.log('✅ Look salvo no AsyncStorage. Total:', listaAtualizada.length);
    setLookJaSalvo(true);
    alert('Look salvo! Veja em Meu Perfil → Meus Looks.');
  };

  const concluirLook = async () => {
    if (!lookJaSalvo && lookAtual) {
      const novoLookSalvo: LookSalvo = {
        id: String(Date.now()),
        data: new Date().toISOString(),
        pecas: lookAtual,
      };
      const listaAtualizada = [novoLookSalvo, ...looksSalvos];
      setLooksSalvos(listaAtualizada);
      await AsyncStorage.setItem('@closet_looks', JSON.stringify(listaAtualizada));
    }
    setTelaAtual('armario');
    setLookAtual(null);
    setLookJaSalvo(false);
  };

  const repetirLook = (look: LookSalvo) => {
    setLookAtual(look.pecas);
    setOrigemLook('repetido');
    setTelaAtual('resultado');
  };

  const excluirLookSalvo = async (id: string) => {
    const listaAtualizada = looksSalvos.filter((l) => l.id !== id);
    setLooksSalvos(listaAtualizada);
    await AsyncStorage.setItem('@closet_looks', JSON.stringify(listaAtualizada));
  };

  const roupasFiltradas = useMemo(() => {
    return roupas.filter((roupa) => {
      const categoriaMatch =
        categoriaFiltro === 'todas' || roupa.categoria === categoriaFiltro;
      const buscaMatch = roupa.nome
        .toLowerCase()
        .includes(busca.toLowerCase().trim());
      return categoriaMatch && buscaMatch;
    });
  }, [roupas, busca, categoriaFiltro]);

  const carregarRoupas = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('@closet_roupas');
      if (dadosSalvos) setRoupas(JSON.parse(dadosSalvos));
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarRoupa = async (roupa: Roupa) => {
    let listaAtualizada;
    if (telaAtual === 'editar') {
      listaAtualizada = roupas.map((r) => (r.id === roupa.id ? roupa : r));
    } else {
      listaAtualizada = [...roupas, roupa];
    }
    setRoupas(listaAtualizada);
    await AsyncStorage.setItem(
      '@closet_roupas',
      JSON.stringify(listaAtualizada)
    );
    setTelaAtual('armario');
    setRoupaSelecionada(null);
  };

  const excluirRoupa = async (motivo: string) => {
    if (!roupaSelecionada) return;

    const roupaComMotivo = { ...roupaSelecionada, motivoDescarte: motivo };

    const listaAtualizada = roupas.filter((r) => r.id !== roupaSelecionada.id);
    setRoupas(listaAtualizada);
    await AsyncStorage.setItem(
      '@closet_roupas',
      JSON.stringify(listaAtualizada)
    );

    try {
      const historicoSalvo = await AsyncStorage.getItem('@closet_descartes');
      const historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
      historico.push({
        ...roupaComMotivo,
        dataDescarte: new Date().toISOString(),
      });
      await AsyncStorage.setItem(
        '@closet_descartes',
        JSON.stringify(historico)
      );
    } catch (e) {
      console.error('Erro ao salvar histórico de descarte:', e);
    }

    setTelaAtual('armario');
    setRoupaSelecionada(null);
  };

  const abrirDetalhes = (roupa: Roupa) => {
    setRoupaSelecionada(roupa);
    setTelaAtual('detalhes');
  };

  const iniciarEdicao = () => {
    setTelaAtual('editar');
  };

  const toggleMenu = () => setMenuAberto(!menuAberto);

  const entrarModoSelecao = (id: string) => {
    setModoSelecao(true);
    setSelecionadas([id]);
  };

  const sairModoSelecao = () => {
    setModoSelecao(false);
    setSelecionadas([]);
  };

  const toggleSelecionada = (id: string) => {
    setSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  };

  const aoTocarPeca = (roupa: Roupa) => {
    if (modoSelecao) {
      toggleSelecionada(roupa.id);
    } else {
      abrirDetalhes(roupa);
    }
  };

  const abrirModalExclusao = () => {
    if (selecionadas.length === 0) return;
    setModalMotivoAberto(true);
  };

  const excluirSelecionadas = async (motivo: string) => {
    const listaAtualizada = roupas.filter((r) => !selecionadas.includes(r.id));
    setRoupas(listaAtualizada);
    await AsyncStorage.setItem(
      '@closet_roupas',
      JSON.stringify(listaAtualizada)
    );

    try {
      const historicoSalvo = await AsyncStorage.getItem('@closet_descartes');
      const historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
      const novasEntradas = roupas
        .filter((r) => selecionadas.includes(r.id))
        .map((r) => ({
          ...r,
          motivoDescarte: motivo,
          dataDescarte: new Date().toISOString(),
        }));
      await AsyncStorage.setItem(
        '@closet_descartes',
        JSON.stringify([...historico, ...novasEntradas])
      );
    } catch (e) {
      console.error('Erro ao salvar histórico:', e);
    }

    setModalMotivoAberto(false);
    sairModoSelecao();
  };

  const irParaAdicionar = () => {
    setMenuAberto(false);
    setRoupaSelecionada(null);
    setTelaAtual('adicionar');
  };

  // ---------- LÓGICA DO LOOK ----------
  const gerarLook = (): Look | null => {
    const superiores = roupas.filter((r) => r.categoria === 'parte_superior');
    const inferiores = roupas.filter((r) => r.categoria === 'parte_inferior');
    const calcados = roupas.filter((r) => r.categoria === 'calcado');
    const acessorios = roupas.filter((r) => r.categoria === 'acessorio');

    if (
      superiores.length === 0 ||
      inferiores.length === 0 ||
      calcados.length === 0
    ) {
      alert(
        'Você precisa ter pelo menos uma peça de cada: Parte Superior, Parte Inferior e Calçado para montar um look básico.'
      );
      return null;
    }

    const pegarAleatorio = (lista: Roupa[]) =>
      lista[Math.floor(Math.random() * lista.length)];

    const superior = pegarAleatorio(superiores);
    const inferior = pegarAleatorio(inferiores);
    const calcado = pegarAleatorio(calcados);

    let acessorio: Roupa | null = null;
    if (acessorios.length > 0) {
      const compativeis = acessorios.filter(
        (a) =>
          a.cor.toLowerCase() === superior.cor.toLowerCase() ||
          a.cor.toLowerCase() === inferior.cor.toLowerCase()
      );
      acessorio =
        compativeis.length > 0
          ? pegarAleatorio(compativeis)
          : pegarAleatorio(acessorios);
    }

    return { superior, inferior, calcado, acessorio };
  };

  const montarLook = () => {
    setMenuAberto(false);
    const novoLook = gerarLook();
    if (!novoLook) return;
    setLookAtual(novoLook);
    setOrigemLook('aleatorio');
    setLookJaSalvo(false);
    setTelaAtual('montando');
  };

  const montarOutroLook = () => {
    const novoLook = gerarLook();
    if (!novoLook) return;
    setLookAtual(novoLook);
    setOrigemLook('aleatorio');
    setLookJaSalvo(false);
    setTelaAtual('montando');
  };

  const montarLookManual = () => {
    const pecasSelecionadas = roupas.filter((r) => selecionadas.includes(r.id));

    const superiores = pecasSelecionadas.filter((r) => r.categoria === 'parte_superior');
    const inferiores = pecasSelecionadas.filter((r) => r.categoria === 'parte_inferior');
    const calcados = pecasSelecionadas.filter((r) => r.categoria === 'calcado');
    const acessorios = pecasSelecionadas.filter((r) => r.categoria === 'acessorio');

    if (superiores.length === 0 || inferiores.length === 0 || calcados.length === 0) {
      const faltando: string[] = [];
      if (superiores.length === 0) faltando.push('Parte Superior');
      if (inferiores.length === 0) faltando.push('Parte Inferior');
      if (calcados.length === 0) faltando.push('Calçado');
      alert(
        `Para montar um look manual, selecione pelo menos uma peça de cada categoria:\n\nFaltando: ${faltando.join(', ')}`
      );
      return;
    }

    if (superiores.length > 1 || inferiores.length > 1 || calcados.length > 1) {
      alert(
        'Você selecionou mais de uma peça da mesma categoria. O look vai usar a primeira de cada.'
      );
    }

    const novoLook: Look = {
      superior: superiores[0],
      inferior: inferiores[0],
      calcado: calcados[0],
      acessorio: acessorios.length > 0 ? acessorios[0] : null,
    };

    sairModoSelecao();
    setLookAtual(novoLook);
    setOrigemLook('manual');
    setLookJaSalvo(false);
    setTelaAtual('montando');
  };
  // ------------------------------------

  // Tela de Adicionar / Editar
  if (telaAtual === 'adicionar' || telaAtual === 'editar') {
    return (
      <AdicionarRoupa
        aoSalvar={salvarRoupa}
        aoCancelar={() => {
          setTelaAtual(roupaSelecionada ? 'detalhes' : 'armario');
          if (telaAtual === 'adicionar') setRoupaSelecionada(null);
        }}
        roupaEmEdicao={telaAtual === 'editar' ? roupaSelecionada : null}
      />
    );
  }

  // Tela de Detalhes
  if (telaAtual === 'detalhes' && roupaSelecionada) {
    return (
      <DetalhesRoupa
        roupa={roupaSelecionada}
        aoEditar={iniciarEdicao}
        aoExcluir={() => setTelaAtual('excluir')}
        aoVoltar={() => {
          setTelaAtual('armario');
          setRoupaSelecionada(null);
        }}
      />
    );
  }

  // Tela de Exclusão (fluxo antigo, pelos detalhes)
  if (telaAtual === 'excluir' && roupaSelecionada) {
    return (
      <ExcluirRoupa
        roupa={roupaSelecionada}
        aoConfirmar={excluirRoupa}
        aoCancelar={() => setTelaAtual('detalhes')}
      />
    );
  }

  // Tela de "Pensando" (cutscene)
  if (telaAtual === 'montando' && lookAtual) {
    return (
      <MontandoLook
        look={lookAtual}
        aoTerminar={() => setTelaAtual('resultado')}
      />
    );
  }

  // Tela de Resultado do Look
  if (telaAtual === 'resultado' && lookAtual) {
    return (
      <ResultadoLook
        look={lookAtual}
        origem={origemLook}
        aoMontarOutro={montarOutroLook}
        aoSalvarLook={salvarLookAtual}
        aoFechar={concluirLook}
        aoEditarPeca={(roupa) => {
          setRoupaSelecionada(roupa);
          setTelaAtual('detalhes');
        }}
      />
    );
  }

  // Tela de Perfil
  if (telaAtual === 'perfil') {
    return (
      <Perfil
        perfil={perfil}
        aoSalvar={salvarPerfil}
        aoVoltar={() => setTelaAtual('armario')}
        aoVerLooks={() => setTelaAtual('meusLooks')}
        aoSalvarLookAtual={lookAtual ? salvarLookAtual : undefined}
      />
    );
  }

  // Tela de Meus Looks
  if (telaAtual === 'meusLooks') {
    return (
      <MeusLooks
        looks={looksSalvos}
        aoRepetir={repetirLook}
        aoExcluir={excluirLookSalvo}
        aoVoltar={() => setTelaAtual('perfil')}
      />
    );
  }

  // Tela de Carregamento
  if (carregando) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          Abrindo o armário...
        </Text>
      </View>
    );
  }

  // Tela Principal (Armário)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {modoSelecao ? (
        <View style={styles.barraSelecao}>
          <TouchableOpacity onPress={sairModoSelecao} style={styles.barraBotao}>
            <Ionicons name="close-outline" size={26} color="#333" />
          </TouchableOpacity>

          <Text style={styles.barraTexto}>
            {selecionadas.length} selecionada
            {selecionadas.length > 1 ? 's' : ''}
          </Text>

          <View style={styles.barraAcoes}>
            <TouchableOpacity
              onPress={montarLookManual}
              style={styles.barraBotao}
              disabled={selecionadas.length === 0}
            >
              <Ionicons
                name="sparkles-outline"
                size={24}
                color={selecionadas.length === 0 ? '#ccc' : '#4A90E2'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={abrirModalExclusao} style={styles.barraBotao}>
              <Ionicons name="trash-outline" size={24} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <View style={styles.headerTexto}>
            <Text style={styles.title}>Closet Virtual</Text>
            <Text style={styles.subtitle}>
              {roupasFiltradas.length} de {roupas.length} peças
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarBotao}
            onPress={() => setTelaAtual('perfil')}
            activeOpacity={0.7}
          >
            {perfil ? (
              <View
                style={[
                  styles.avatarCirculo,
                  { backgroundColor: perfil.corAvatar },
                ]}
              >
                {perfil.avatar === 'emoji' ? (
                  <Text style={styles.avatarEmoji}>
                    {perfil.emoji || '👤'}
                  </Text>
                ) : (
                  <Text style={styles.avatarInicial}>
                    {perfil.nome.trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.avatarCirculoVazio}>
                <Ionicons name="person-outline" size={22} color="#4A90E2" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {!modoSelecao && (
        <>
          <View style={styles.buscaContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#888"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.buscaInput}
              placeholder="Buscar peça pelo nome..."
              value={busca}
              onChangeText={setBusca}
              placeholderTextColor="#999"
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca('')}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filtrosContainer}>
            {[
              'todas',
              'parte_superior',
              'parte_inferior',
              'calcado',
              'acessorio',
            ].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filtroBotao,
                  categoriaFiltro === cat && styles.filtroBotaoAtivo,
                ]}
                onPress={() => setCategoriaFiltro(cat)}
              >
                <Text
                  style={[
                    styles.filtroTexto,
                    categoriaFiltro === cat && styles.filtroTextoAtivo,
                  ]}
                >
                  {cat === 'todas' ? 'Todas' : cat.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <FlatList
        data={roupasFiltradas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {roupas.length === 0
                ? 'Seu armário está vazio.'
                : 'Nenhuma peça encontrada.'}
            </Text>
            <Text style={styles.emptySubtext}>
              {roupas.length === 0
                ? 'Toque no menu para adicionar sua primeira peça!'
                : 'Tente outro filtro ou termo de busca.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const selecionada = selecionadas.includes(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.roupaCard,
                selecionada && styles.roupaCardSelecionada,
              ]}
              onPress={() => aoTocarPeca(item)}
              onLongPress={() => {
                if (!modoSelecao) entrarModoSelecao(item.id);
              }}
              delayLongPress={400}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.fotoUri }} style={styles.roupaImagem} />
              <View style={styles.roupaInfo}>
                <Text style={styles.roupaNome} numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text style={styles.roupaCor}>{item.cor}</Text>
              </View>
              {selecionada && (
                <View style={styles.checkOverlay}>
                  <Ionicons
                    name="checkmark-circle"
                    size={30}
                    color="#4A90E2"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {!modoSelecao && menuAberto && (
        <View style={styles.menuOpcoes}>
          <TouchableOpacity style={styles.menuOpcaoItem} onPress={montarLook}>
            <View style={styles.menuOpcaoIcone}>
              <Ionicons name="sparkles-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.menuOpcaoTexto}>Montar Look</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuOpcaoItem}
            onPress={irParaAdicionar}
          >
            <View style={styles.menuOpcaoIcone}>
              <Ionicons name="add-outline" size={22} color="#fff" />
            </View>
            <Text style={styles.menuOpcaoTexto}>Adicionar Item</Text>
          </TouchableOpacity>
        </View>
      )}

      {!modoSelecao && (
        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <Ionicons
            name={menuAberto ? 'close-outline' : 'menu-outline'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      <ModalMotivo
        visivel={modalMotivoAberto}
        quantidade={selecionadas.length}
        aoConfirmar={excluirSelecionadas}
        aoCancelar={() => setModalMotivoAberto(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTexto: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },

  avatarBotao: { marginLeft: 12 },
  avatarCirculo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCirculoVazio: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF2FD',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  avatarInicial: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  avatarEmoji: { fontSize: 22 },

  barraSelecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  barraBotao: { padding: 4 },
  barraTexto: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  barraAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buscaInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: '#333' },

  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filtroBotao: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filtroBotaoAtivo: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  filtroTexto: { fontSize: 13, color: '#555', textTransform: 'capitalize' },
  filtroTextoAtivo: { color: '#fff', fontWeight: 'bold' },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  menuOpcoes: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    alignItems: 'flex-end',
    gap: 12,
  },
  menuOpcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuOpcaoIcone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuOpcaoTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },

  roupaCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  roupaCardSelecionada: { borderWidth: 2, borderColor: '#4A90E2' },
  checkOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  roupaImagem: { width: '100%', height: 180, resizeMode: 'cover' },
  roupaInfo: { padding: 10 },
  roupaNome: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  roupaCor: { fontSize: 12, color: '#777', marginTop: 2 },
});