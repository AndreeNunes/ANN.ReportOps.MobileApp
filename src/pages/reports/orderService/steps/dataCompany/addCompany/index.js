import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TextInput from "../../../../../../components/TextInput";
import MaskedInput from "../../../../../../components/MaskedInput";
import Button from "../../../../../../components/Button";
import InfoBanner from "../../../../../../components/InfoBanner";
import Toast from "react-native-toast-message";
import { createCompany } from "../../../../../../service/company";
import styles from "./styles";

export default function AddCompany({ route, navigation }) {
  const [name, setName] = useState(null);
  const [document, setDocument] = useState(null);
  const [street, setStreet] = useState(null);
  const [number, setNumber] = useState(null);
  const [complement, setComplement] = useState(null);
  const [neighborhood, setNeighborhood] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    if (!name) {
      Toast.show({ type: 'warning', text1: 'Atenção', text2: 'O nome da empresa é obrigatório' });
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        name,
        document,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code: zipCode,
        phone,
        email,
      };
      const res = await createCompany(payload);
      if (res?.success) {
        Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Empresa criada com sucesso' });
        navigation.goBack();
      } else {
        Toast.show({ type: 'error', text1: 'Erro', text2: res?.message || 'Não foi possível criar a empresa' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Ocorreu um erro ao criar a empresa' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <InfoBanner
          storageKey="@banner_suffix_auto_assignment"
          message="Preencha os dados e toque em Adicionar empresa."
        />

        <View style={{ height: 16 }} />

        <TextInput label="Nome" placeholder="Digite o nome" value={name} onChangeText={setName} />
        <View style={{ height: 24 }} />

        <MaskedInput
          label="CNPJ"
          placeholder="Digite o CNPJ"
          value={document}
          onChangeText={setDocument}
          pattern={"##.###.###/####-##"}
          keyboardType="number-pad"
        />
        <View style={{ height: 24 }} />

        <TextInput label="Rua" placeholder="Digite a rua" value={street} onChangeText={setStreet} />
        <View style={{ height: 24 }} />

        <TextInput label="Número" placeholder="Digite o número" value={number} onChangeText={setNumber} keyboardType="number-pad" />
        <View style={{ height: 24 }} />

        <TextInput label="Complemento" placeholder="Digite o complemento" value={complement} onChangeText={setComplement} />
        <View style={{ height: 24 }} />

        <TextInput label="Bairro" placeholder="Digite o bairro" value={neighborhood} onChangeText={setNeighborhood} />
        <View style={{ height: 24 }} />

        <TextInput label="Cidade" placeholder="Digite a cidade" value={city} onChangeText={setCity} />
        <View style={{ height: 24 }} />

        <MaskedInput
          label="Estado"
          placeholder="UF"
          value={state}
          onChangeText={setState}
          pattern={"AA"}
          autoCapitalize="characters"
        />
        <View style={{ height: 24 }} />

        <MaskedInput
          label="CEP"
          placeholder="Digite o CEP"
          value={zipCode}
          onChangeText={setZipCode}
          pattern={"#####-###"}
          keyboardType="number-pad"
        />
        <View style={{ height: 24 }} />

        <TextInput label="Telefone" placeholder="Digite o telefone" value={phone} onChangeText={setPhone} />
        <View style={{ height: 24 }} />

        <TextInput label="E-mail" placeholder="Digite o e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={{ height: 32 }} />

        <Button title="Adicionar empresa" onPress={handleSave} loading={isSaving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
