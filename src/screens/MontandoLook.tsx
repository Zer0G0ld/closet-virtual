// src/screens/MontandoLook.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Roupa } from '../types/Roupa';

interface Props {
  look: {
    superior: Roupa;
    inferior: Roupa;
    calcado: Roupa;
    acessorio: Roupa | null;
  };
  aoTerminar: () => void;
}

const MENSAGENS = [
  'Analisando seu armário...',
  'Verificando as categorias...',
  'Combinando cores e estilos...',
  'Separando as peças ideais...',
  'Finalizando seu look...',
];

export default function MontandoLook({ look, aoTerminar }: Props) {
  const [indiceMensagem, setIndiceMensagem] = useState(0);
  const [opacidade] = useState(new Animated.Value(1));
  const [rotacao] = useState(new Animated.Value(0));
  const [escala] = useState(new Animated.Value(0.8));

  // Animação de fade + slide das mensagens
  useEffect(() => {
    // Animação de entrada do ícone
    Animated.spring(escala, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    // Rotação contínua do ícone
    Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Troca de mensagens com fade
    let atual = 0;
    const intervalo = setInterval(() => {
      atual++;
      if (atual >= MENSAGENS.length) {
        clearInterval(intervalo);
        setTimeout(aoTerminar, 400);
        return;
      }
      Animated.sequence([
        Animated.timing(opacidade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacidade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setIndiceMensagem(atual);
    }, 900);

    return () => clearInterval(intervalo);
  }, []);

  const spin = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconeContainer,
          { transform: [{ scale: escala }, { rotate: spin }] },
        ]}
      >
        <Ionicons name="sparkles" size={64} color="#4A90E2" />
      </Animated.View>

      <Animated.Text style={[styles.mensagem, { opacity: opacidade }]}>
        {MENSAGENS[indiceMensagem]}
      </Animated.Text>

      <View style={styles.progressoContainer}>
        {MENSAGENS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressoPonto,
              i <= indiceMensagem && styles.progressoPontoAtivo,
            ]}
          />
        ))}
      </View>

      <Text style={styles.dica}>
        Dica: quanto mais peças você tiver, melhores serão as combinações.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  mensagem: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  progressoContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  progressoPonto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  progressoPontoAtivo: {
    backgroundColor: '#4A90E2',
  },
  dica: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
  },
});