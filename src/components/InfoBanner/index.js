import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function InfoBanner({
  storageKey = '@banner_semicolon_topics_dismissed',
  message = "Nesta sessão, tudo que for separado por ';' será transformado em tópicos no PDF.",
  icon = <Ionicons name="information-circle-outline" size={22} color="#0c2168" />,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const dismissed = await AsyncStorage.getItem(storageKey);
        setVisible(dismissed !== '1');
      } catch {
        setVisible(true);
      }
    };
    load();
  }, [storageKey]);

  const dismiss = async () => {
    try {
      await AsyncStorage.setItem(storageKey, '1');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.leftIcon}>{icon}</View>
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity style={styles.close} onPress={dismiss} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
        <Ionicons name="close" size={18} color="#0c2168" />
      </TouchableOpacity>
    </View>
  );
}

