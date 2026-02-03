import { Text, KeyboardAvoidingView, ScrollView, Platform, View } from "react-native";
import styles from "./styles";
import { useEffect, useState } from "react";
import TextInput from "../../../../../components/TextInput";
import Button from "../../../../../components/Button";
import { updateOrderService } from "../../../../../storage/order_service";
import { updateReport } from "../../../../../storage/report";
import MaskedInput from "../../../../../components/MaskedInput";

export default function DataMaintenancePlans({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [mpOil, setMpOil] = useState(null);
  const [mpAirOilSeparatorElement, setMpAirOilSeparatorElement] = useState(null);
  const [mpPrimaryAirFilter, setMpPrimaryAirFilter] = useState(null);
  const [mpSecondaryAirFilter, setMpSecondaryAirFilter] = useState(null);
  const [mpStandardAirFilter, setMpStandardAirFilter] = useState(null);
  const [mpOilFilter, setMpOilFilter] = useState(null);
  const [mpEngineLubricant, setMpEngineLubricant] = useState(null);
  const [mpCoalescingElement, setMpCoalescingElement] = useState(null);
  const [mpCompressorElementRevision, setMpCompressorElementRevision] = useState(null);


  useEffect(() => {
    if (orderService) {
      setMpOil(orderService.mp_oil);
      setMpAirOilSeparatorElement(orderService.mp_air_oil_separator_element);
      setMpPrimaryAirFilter(orderService.mp_primary_air_filter);
      setMpSecondaryAirFilter(orderService.mp_secondary_air_filter);
      setMpStandardAirFilter(orderService.mp_standard_air_filter);
      setMpOilFilter(orderService.mp_oil_filter);
      setMpEngineLubricant(orderService.mp_engine_lubricant);
      setMpCoalescingElement(orderService.mp_coalescing_element);
      setMpCompressorElementRevision(orderService.mp_compressor_element_revision);
    }
  }, [orderService]);

  const handleSave = async () => {
    if (!id) {
      return;
    }

    await updateOrderService(id, {
      mp_oil: mpOil,
      mp_air_oil_separator_element: mpAirOilSeparatorElement,
      mp_primary_air_filter: mpPrimaryAirFilter,
      mp_secondary_air_filter: mpSecondaryAirFilter,
      mp_standard_air_filter: mpStandardAirFilter,
      mp_oil_filter: mpOilFilter,
      mp_engine_lubricant: mpEngineLubricant,
      mp_coalescing_element: mpCoalescingElement,
      mp_compressor_element_revision: mpCompressorElementRevision,
    });

    await updateReport(id, {
      sync: false,
    });

    navigation.goBack();
  }

  // Usa um único estado (mpOil) com partes separadas por '&'
  const mpOilParts = (mpOil || '&').split('&');
  const mpOilName = mpOilParts[0] || '';
  const mpOilDate = mpOilParts[1] || '';
  const mpAirOilSeparatorElementParts = (mpAirOilSeparatorElement || '&').split('&');
  const mpAirOilSeparatorElementValue = mpAirOilSeparatorElementParts[0] || '';
  const mpAirOilSeparatorElementDate = mpAirOilSeparatorElementParts[1] || '';
  const mpPrimaryAirFilterParts = (mpPrimaryAirFilter || '&').split('&');
  const mpPrimaryAirFilterValue = mpPrimaryAirFilterParts[0] || '';
  const mpPrimaryAirFilterDate = mpPrimaryAirFilterParts[1] || '';
  const mpSecondaryAirFilterParts = (mpSecondaryAirFilter || '&').split('&');
  const mpSecondaryAirFilterValue = mpSecondaryAirFilterParts[0] || '';
  const mpSecondaryAirFilterDate = mpSecondaryAirFilterParts[1] || '';
  const mpStandardAirFilterParts = (mpStandardAirFilter || '&').split('&');
  const mpStandardAirFilterValue = mpStandardAirFilterParts[0] || '';
  const mpStandardAirFilterDate = mpStandardAirFilterParts[1] || '';
  const mpOilFilterParts = (mpOilFilter || '&').split('&');
  const mpOilFilterValue = mpOilFilterParts[0] || '';
  const mpOilFilterDate = mpOilFilterParts[1] || '';
  const mpEngineLubricantParts = (mpEngineLubricant || '&').split('&');
  const mpEngineLubricantValue = mpEngineLubricantParts[0] || '';
  const mpEngineLubricantDate = mpEngineLubricantParts[1] || '';
  const mpCoalescingElementParts = (mpCoalescingElement || '&').split('&');
  const mpCoalescingElementValue = mpCoalescingElementParts[0] || '';
  const mpCoalescingElementDate = mpCoalescingElementParts[1] || '';
  const mpCompressorElementRevisionParts = (mpCompressorElementRevision || '&').split('&');
  const mpCompressorElementRevisionValue = mpCompressorElementRevisionParts[0] || '';
  const mpCompressorElementRevisionDate = mpCompressorElementRevisionParts[1] || '';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 64 }}
        keyboardShouldPersistTaps="handled"
      >
        <MaskedInput
          label="Óleo"
          placeholder="Digite a quilometragem"
          value={mpOilName}
          onChangeText={(v) => setMpOil([v || '', mpOilDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpOilDate}
          onChangeText={(v) => setMpOil([mpOilName || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Elemento separador de Ar/Óleo"
          placeholder="Digite o valor"
          value={mpAirOilSeparatorElementValue}
          onChangeText={(v) => setMpAirOilSeparatorElement([v || '', mpAirOilSeparatorElementDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpAirOilSeparatorElementDate}
          onChangeText={(v) => setMpAirOilSeparatorElement([mpAirOilSeparatorElementValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Filtro de ar primário"
          placeholder="Digite o valor"
          value={mpPrimaryAirFilterValue}
          onChangeText={(v) => setMpPrimaryAirFilter([v || '', mpPrimaryAirFilterDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpPrimaryAirFilterDate}
          onChangeText={(v) => setMpPrimaryAirFilter([mpPrimaryAirFilterValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Filtro de ar secundário"
          placeholder="Digite o valor"
          value={mpSecondaryAirFilterValue}
          onChangeText={(v) => setMpSecondaryAirFilter([v || '', mpSecondaryAirFilterDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpSecondaryAirFilterDate}
          onChangeText={(v) => setMpSecondaryAirFilter([mpSecondaryAirFilterValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Filtro de ar standard"
          placeholder="Digite o valor"
          value={mpStandardAirFilterValue}
          onChangeText={(v) => setMpStandardAirFilter([v || '', mpStandardAirFilterDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpStandardAirFilterDate}
          onChangeText={(v) => setMpStandardAirFilter([mpStandardAirFilterValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Filtro de óleo"
          placeholder="Digite o valor"
          value={mpOilFilterValue}
          onChangeText={(v) => setMpOilFilter([v || '', mpOilFilterDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpOilFilterDate}
          onChangeText={(v) => setMpOilFilter([mpOilFilterValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Lubrificante do motor"
          placeholder="Digite o valor"
          value={mpEngineLubricantValue}
          onChangeText={(v) => setMpEngineLubricant([v || '', mpEngineLubricantDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpEngineLubricantDate}
          onChangeText={(v) => setMpEngineLubricant([mpEngineLubricantValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Elemento coalescente"
          placeholder="Digite o valor"
          value={mpCoalescingElementValue}
          onChangeText={(v) => setMpCoalescingElement([v || '', mpCoalescingElementDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpCoalescingElementDate}
          onChangeText={(v) => setMpCoalescingElement([mpCoalescingElementValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Revisão do elemento do compressor"
          placeholder="Digite o valor"
          value={mpCompressorElementRevisionValue}
          onChangeText={(v) => setMpCompressorElementRevision([v || '', mpCompressorElementRevisionDate || ''].join('&'))}
          mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
          keyboardType="number-pad"
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label=""
          placeholder="Digite a data"
          value={mpCompressorElementRevisionDate}
          onChangeText={(v) => setMpCompressorElementRevision([mpCompressorElementRevisionValue || '', v || ''].join('&'))}
          pattern={"##/##/####"}
          keyboardType="number-pad"
        />

        <View style={{ height: 32 }} />

        <Button title="Salvar" onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}