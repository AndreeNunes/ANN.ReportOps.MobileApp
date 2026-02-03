import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Toast from 'react-native-toast-message';
import styles from '../styles';
import StepDots from '../../../components/StepDots';

export default function StepIdentity({ route, navigation }) {
  const { code, validateData } = route.params || {};
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [loading, setLoading] = useState(false);

  const onlyDigits = (v) => String(v || '').replace(/\D/g, '');

  const handleNext = () => {
    if (!name?.trim()) {
      Toast.show({ text1: 'Atenção', text2: 'Informe seu nome.', type: 'warning' });
      return;
    }
    const doc = onlyDigits(document);
    if (doc.length !== 11) {
      Toast.show({ text1: 'Atenção', text2: 'Informe um CPF válido (11 dígitos).', type: 'warning' });
      return;
    }
    navigation.navigate('RegisterStepCredentials', {
      code,
      validateData,
      name: name.trim(),
      document: doc,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 64 }} keyboardShouldPersistTaps="handled">
          <StepDots current={2} total={3} position="top" />

          <View style={{ height: 24 }} />

          <View style={styles.card}>
            <View style={styles.titleContainer}>
              <Text style={styles.textTitle}>Identificação</Text>
              <Text style={styles.textSubtitle}>Informe seu nome e CPF.</Text>
            </View>

            <TextInput
              label="Nome"
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.spacer} />

            <TextInput
              label="CPF"
              placeholder="Apenas números"
              value={document}
              onChangeText={setDocument}
              keyboardType="number-pad"
              maxLength={14}
            />

            <View style={styles.spacer} />

            <Button title="Continuar" onPress={handleNext} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

