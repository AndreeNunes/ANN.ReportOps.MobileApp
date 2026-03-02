import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TextInput from "../../../../../../components/TextInput";
import MaskedInput from "../../../../../../components/MaskedInput";
import Button from "../../../../../../components/Button";
import InfoBanner from "../../../../../../components/InfoBanner";
import Toast from "react-native-toast-message";
import { createCompany, getAddressByCep, getAllCompanies, updateCompany } from "../../../../../../service/company";
import styles from "./styles";

export default function AddCompany({ route, navigation }) {
  const company = route?.params?.company || null;
  const isEdit = route?.params?.mode === "edit" || !!company;

  const [name, setName] = useState(company?.name ?? null);
  const [document, setDocument] = useState(company?.document ?? null);
  const [street, setStreet] = useState(company?.street ?? null);
  const [number, setNumber] = useState(company?.number ?? null);
  const [complement, setComplement] = useState(company?.complement ?? null);
  const [neighborhood, setNeighborhood] = useState(company?.neighborhood ?? null);
  const [city, setCity] = useState(company?.city ?? null);
  const [state, setState] = useState(company?.state ?? null);
  const [zipCode, setZipCode] = useState(company?.zip_code ?? null);
  const [phone, setPhone] = useState(company?.phone ?? null);
  const [email, setEmail] = useState(company?.email ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const lastCepFetchedRef = useRef(null);
  const phoneMask = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length > 10) {
      return ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
    }
    return ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!name) {
      Toast.show({ type: 'warning', text1: 'Atenção', text2: 'O nome da empresa é obrigatório' });
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        id: company?.id,
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
      const res = isEdit ? await updateCompany(payload) : await createCompany(payload);
      if (res?.success) {
        // Após criar, atualiza cache local de empresas (AsyncStorage @companies)
        try {
          await getAllCompanies();
        } catch {}
        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: isEdit ? "Empresa atualizada com sucesso" : "Empresa criada com sucesso",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: res?.message || (isEdit ? "Não foi possível atualizar a empresa" : "Não foi possível criar a empresa"),
        });
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: isEdit ? "Ocorreu um erro ao atualizar a empresa" : "Ocorreu um erro ao criar a empresa",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleZipCodeChange = async (value) => {
    setZipCode(value);

    const normalizedCep = String(value || "").replace(/\D/g, "");

    if (normalizedCep.length !== 8) {
      return;
    }

    if (lastCepFetchedRef.current === normalizedCep) {
      return;
    }

    lastCepFetchedRef.current = normalizedCep;

    try {
      setIsLoadingCep(true);
      const response = await getAddressByCep(normalizedCep);

      if (!response?.success || !response?.data) {
        lastCepFetchedRef.current = null;
        Toast.show({
          type: "warning",
          text1: "Atenção",
          text2: response?.message || "Não foi possível buscar o endereço pelo CEP.",
        });
        return;
      }

      setStreet(response.data.street ?? "");
      setNeighborhood(response.data.neighborhood ?? "");
      setCity(response.data.city ?? "");
      setState(response.data.state ?? "");
    } catch (e) {
      lastCepFetchedRef.current = null;
      Toast.show({
        type: "warning",
        text1: "Atenção",
        text2: "Não foi possível buscar o endereço pelo CEP.",
      });
    } finally {
      setIsLoadingCep(false);
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
          message={isEdit ? "Atualize os dados da empresa e toque em Salvar alterações." : "Preencha os dados e toque em Adicionar empresa."}
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

        <MaskedInput
          label="CEP"
          placeholder="Digite o CEP"
          value={zipCode}
          onChangeText={handleZipCodeChange}
          pattern={"#####-###"}
          keyboardType="number-pad"
        />
        {isLoadingCep && (
          <>
            <View style={{ height: 8 }} />
            <InfoBanner
              storageKey="@banner_loading_cep"
              message="Buscando endereço pelo CEP..."
            />
          </>
        )}
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
          mask={[/[A-Za-z]/, /[A-Za-z]/]}
          autoCapitalize="characters"
        />
        <View style={{ height: 24 }} />

        <MaskedInput
          label="Telefone"
          placeholder="Digite o telefone"
          value={phone}
          onChangeText={setPhone}
          mask={phoneMask}
          keyboardType="number-pad"
        />
        <View style={{ height: 24 }} />

        <TextInput label="E-mail" placeholder="Digite o e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={{ height: 32 }} />

        <Button title={isEdit ? "Salvar alterações" : "Adicionar empresa"} onPress={handleSave} loading={isSaving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
