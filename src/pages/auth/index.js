import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInput from "../../components/TextInput";
import styles from "./styles";
import Button from "../../components/Button";
import { authService } from "../../service/auth";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const Auth = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email?.trim()) {
      Toast.show({ text1: 'Atenção', text2: 'Informe seu e-mail.', type: 'warning' });
      return;
    }
    if (!password?.trim()) {
      Toast.show({ text1: 'Atenção', text2: 'Informe sua senha.', type: 'warning' });
      return;
    }
    setLoading(true);

    const turn = await authService.login(email, password);

    setLoading(false);

    if (turn.success) {
      Toast.show({ text1: 'Bem-vindo!', type: 'success' });
      navigation.navigate('Main');
    } else {
      Toast.show({ text1: 'Erro ao entrar', text2: turn?.message || 'Verifique suas credenciais.', type: 'error' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 64 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image source={require('../../../assets/icon.png')} style={styles.logo} />
          </View>

          <View style={styles.card}>
            <View style={styles.titleContainer}>
              <Text style={styles.textTitle}>Entrar</Text>
              <Text style={styles.textSubtitle}>Acesse com seu e-mail e senha.</Text>
            </View>

            <TextInput
              label="E-mail"
              placeholder="Seu e-mail"
              value={email}
              onChangeText={setEmail}
              disabled={loading}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.spacer} />

            <TextInput
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              disabled={loading}
            />

            <TouchableOpacity style={styles.forgotContainer} activeOpacity={0.7} onPress={() => {
              Alert.alert('Aviso!', 'Esta funcionalidade será disponibilizada em breve.');
            }}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              onPress={handleLogin}
              variant="primary"
              size="large"
              loading={loading}
              style={styles.button}
            />
          
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OU</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterStepCode')}
            activeOpacity={0.7}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              Criar conta
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Auth;