import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodeInput from '../../../components/CodeInput';
import Button from '../../../components/Button';
import Toast from 'react-native-toast-message';
import { authService } from '../../../service/auth';
import styles from '../styles';
import StepDots from '../../../components/StepDots';

export default function StepCode({ navigation }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeCode = (text) => setCode(String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));

  const handleValidate = async () => {
    const normalized = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalized.length !== 6) {
      Toast.show({ text1: 'Atenção', text2: 'Informe o código de 6 caracteres.', type: 'warning' });
      return;
    }
    setLoading(true);
    const res = await authService.validateCode(normalized);
    setLoading(false);
    if (!res.success) {
      Toast.show({ text1: 'Código inválido', text2: res.message, type: 'error' });
      return;
    }
    navigation.navigate('RegisterStepIdentity', {
      code: res.code,
      validateData: res.data,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 64 }} keyboardShouldPersistTaps="handled">
          <StepDots current={1} total={3} position="top" />

          <View style={{ height: 24 }} />

          <View style={styles.card}>
            <View style={styles.titleContainer}>
              <Text style={styles.textTitle}>Cadastro</Text>
              <Text style={styles.textSubtitle}>Valide seu código de cliente.</Text>
            </View>

            <View style={{ marginTop: 4, marginBottom: 12 }}>
              <CodeInput value={code} onChangeValue={onChangeCode} />
            </View>

            <View style={styles.spacer} />

            <Button title="Validar código" onPress={handleValidate} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

