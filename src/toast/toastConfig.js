import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const BaseToast = ({ icon, color, title, message }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={22} color={color} style={styles.icon} />

    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <BaseToast
      icon="checkmark-circle"
      color="#22c55e"
      title={text1}
      message={text2}
    />
  ),

  error: ({ text1, text2 }) => (
    <BaseToast
      icon="close-circle"
      color="#ef4444"
      title={text1}
      message={text2}
    />
  ),

  warning: ({ text1, text2 }) => (
    <BaseToast
      icon="warning"
      color="#facc15"
      title={text1}
      message={text2}
    />
  ),
};
