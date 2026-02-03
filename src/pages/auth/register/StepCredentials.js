import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Toast from 'react-native-toast-message';
import styles from '../styles';
import { authService } from '../../../service/auth';
import StepDots from '../../../components/StepDots';

export default function StepCredentials({ route, navigation }) {
  const { code, validateData, name, document } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      Toast.show({ text1: 'Atenção', text2: 'Informe um e-mail válido.', type: 'warning' });
      return;
    }
    if (!password || password.length < 6) {
      Toast.show({ text1: 'Atenção', text2: 'Senha deve ter ao menos 6 caracteres.', type: 'warning' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ text1: 'Atenção', text2: 'Confirmação de senha não confere.', type: 'warning' });
      return;
    }
    setLoading(true);
    const res = await authService.register({ email: email.trim(), password, name, document, code });
    setLoading(false);
    if (!res.success) {
      Toast.show({ text1: 'Erro no cadastro', text2: res.message, type: 'error' });
      return;
    }
    Toast.show({ text1: 'Cadastro realizado!', type: 'success' });
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 64 }} keyboardShouldPersistTaps="handled">
          
          <StepDots current={3} total={3} position="top" />

          <View style={{ height: 24 }} />

          <View style={styles.card}>
            <View style={styles.titleContainer}>
              <Text style={styles.textTitle}>Credenciais</Text>
              <Text style={styles.textSubtitle}>Defina seu acesso.</Text>
            </View>

            <TextInput
              label="E-mail"
              placeholder="email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.spacer} />

            <TextInput
              label="Senha"
              placeholder="Crie uma senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.spacer} />

            <TextInput
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.spacer} />

            <Button title="Concluir cadastro" onPress={handleRegister} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

