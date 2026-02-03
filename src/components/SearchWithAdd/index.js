import React from 'react';
import { View, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';

export default function SearchWithAdd({
  value,
  onChangeText,
  onSearch,
  onAdd,
  placeholder = 'Pesquisar...',
  isAddButton = true,
}) {
  return (
    <View style={styles.container}>
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
      />
      {isAddButton && (
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
