import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Button from "../../../../../components/Button";
import { updateOrderService } from "../../../../../storage/order_service";
import { useEffect, useState } from "react";
import styles from "./styles";
import SegmentedRadio from "../../../../../components/SegmentedRadio";
import TextInput from "../../../../../components/TextInput";
import MaskedInput from "../../../../../components/MaskedInput";
import InfoBanner from "../../../../../components/InfoBanner";
import { updateReport } from "../../../../../storage/report";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DataRequiredReadings({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [rrLubricatingOilLevel, setRrLubricatingOilLevel] = useState(null);
  const [rrOilStockQuantity, setRrOilStockQuantity] = useState(null);
  const [rrOilModel, setRrOilModel] = useState(null);
  const [rrOilType, setRrOilType] = useState(null);
  const [rrSupplyVoltageUnderLoad, setRrSupplyVoltageUnderLoad] = useState(null);
  const [rrSupplyVoltageUnloaded, setRrSupplyVoltageUnloaded] = useState(null);
  const [rrServiceFactorCurrent, setRrServiceFactorCurrent] = useState(null);
  const [rrElectricalCurrentUnderLoad, setRrElectricalCurrentUnderLoad] = useState(null);
  const [rrElectricalCurrentUnloaded, setRrElectricalCurrentUnloaded] = useState(null);
  const [rrFanMotorCurrent, setRrFanMotorCurrent] = useState(null);
  const [rrCompressorOperatingTemperature, setRrCompressorOperatingTemperature] = useState(null);
  const [rrDryerCurrent, setRrDryerCurrent] = useState(null);
  const [rrDewPointTemperature, setRrDewPointTemperature] = useState(null);
  const [rrAmbientTemperature, setRrAmbientTemperature] = useState(null);

  useEffect(() => {
    if (orderService) {
      setRrLubricatingOilLevel(orderService.rr_lubricating_oil_level);
      setRrOilStockQuantity(orderService.rr_oil_stock_quantity);
      setRrOilModel(orderService.rr_oil_model);
      setRrOilType(orderService.rr_oil_type || null);

      const rawUnderLoad = orderService.rr_supply_voltage_under_load;
      
      if (rawUnderLoad == null || rawUnderLoad === '') {
        setRrSupplyVoltageUnderLoad(null);
      } else {
        const parts = String(rawUnderLoad).split('&');
        const normalized = [(parts[0] || ''), (parts[1] || ''), (parts[2] || '')].join('&');
        setRrSupplyVoltageUnderLoad(normalized);
      }

      const rawUnloaded = orderService.rr_supply_voltage_unloaded;
      if (rawUnloaded == null || rawUnloaded === '') {
        setRrSupplyVoltageUnloaded(null);
      } else {
        const parts2 = String(rawUnloaded).split('&');
        const normalized2 = [(parts2[0] || ''), (parts2[1] || ''), (parts2[2] || '')].join('&');
        setRrSupplyVoltageUnloaded(normalized2);
      }
      setRrServiceFactorCurrent(orderService.rr_service_factor_current);
      setRrElectricalCurrentUnderLoad(orderService.rr_electrical_current_under_load);
      setRrElectricalCurrentUnloaded(orderService.rr_electrical_current_unloaded);
      setRrFanMotorCurrent(orderService.rr_fan_motor_current);
      setRrCompressorOperatingTemperature(orderService.rr_compressor_operating_temperature);
      setRrDryerCurrent(orderService.rr_dryer_current);
      setRrDewPointTemperature(orderService.rr_dew_point_temperature);
      setRrAmbientTemperature(orderService.rr_ambient_temperature);
    }
  }, [orderService]);

  const handleSave = async () => {
    if (!id) {
      return;
    }

    const normalizedUnderLoad =
      [supplyUnderLoadR, supplyUnderLoadS, supplyUnderLoadT].some(Boolean)
        ? [supplyUnderLoadR || '', supplyUnderLoadS || '', supplyUnderLoadT || ''].join('&')
        : null;
    const normalizedUnloaded =
      [supplyUnloadedR, supplyUnloadedS, supplyUnloadedT].some(Boolean)
        ? [supplyUnloadedR || '', supplyUnloadedS || '', supplyUnloadedT || ''].join('&')
        : null;

    await updateOrderService(id, {
      rr_lubricating_oil_level: rrLubricatingOilLevel,
      rr_oil_stock_quantity: rrOilStockQuantity,
      rr_oil_model: rrOilModel,
      rr_oil_type: rrOilType,
      rr_supply_voltage_under_load: normalizedUnderLoad,
      rr_supply_voltage_unloaded: normalizedUnloaded,
      rr_service_factor_current: rrServiceFactorCurrent,
      rr_electrical_current_under_load: rrElectricalCurrentUnderLoad,
      rr_electrical_current_unloaded: rrElectricalCurrentUnloaded,
      rr_fan_motor_current: rrFanMotorCurrent,
      rr_compressor_operating_temperature: rrCompressorOperatingTemperature,
      rr_dryer_current: rrDryerCurrent,
      rr_dew_point_temperature: rrDewPointTemperature,
      rr_ambient_temperature: rrAmbientTemperature,
    });

    await updateReport(id, {
      sync: false,
    });

    navigation.goBack();
  }

  // Garantir que o split nunca quebre quando o valor estiver nulo
  const supplyUnderLoadParts = (rrSupplyVoltageUnderLoad || '&&').split('&');
  const supplyUnderLoadR = supplyUnderLoadParts[0] || '';
  const supplyUnderLoadS = supplyUnderLoadParts[1] || '';
  const supplyUnderLoadT = supplyUnderLoadParts[2] || '';
  const supplyUnloadedParts = (rrSupplyVoltageUnloaded || '&&').split('&');
  const supplyUnloadedR = supplyUnloadedParts[0] || '';
  const supplyUnloadedS = supplyUnloadedParts[1] || '';
  const supplyUnloadedT = supplyUnloadedParts[2] || '';

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 64 }}
          keyboardShouldPersistTaps="handled"
        >
          <InfoBanner
            storageKey="@banner_suffix_auto_assignment"
            message="Todos os sufixos serão atribuídos automaticamente no relatório."
          />

          <View style={{ height: 16 }} />

          <SegmentedRadio
            label="Nível de óleo lubrificante"
            options={[
              { label: 'BAIXO', value: 'BAIXO' },
              { label: 'MEDIO', value: 'MEDIO' },
              { label: 'MAXIMO', value: 'MAXIMO' },
            ]}
            value={rrLubricatingOilLevel}
            onChange={setRrLubricatingOilLevel}
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Quantidade de óleo em estoque"
            placeholder="Digite a quantidade de óleo em estoque"
            value={rrOilStockQuantity}
            onChangeText={setRrOilStockQuantity}
            suffixText="L"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="numeric"
          />

          <View style={{ height: 32 }} />

          <TextInput
            label="Descrição do modelo de óleo"
            placeholder="Digite a descrição do modelo de óleo"
            value={rrOilModel}
            onChangeText={setRrOilModel}
          />

          <View style={{ height: 32 }} />

          <SegmentedRadio
            label="Tipo de óleo"
            options={[
              { label: 'Mineral', value: 'Mineral' },
              { label: 'Semi sintético', value: 'Semi sintético' },
              { label: 'Sintético', value: 'Sintético' },
            ]}
            value={rrOilType}
            onChange={setRrOilType}
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Tensão da rede elétrica com carga"
            placeholder="Digite o R"
            value={supplyUnderLoadR}
            onChangeText={(v) => setRrSupplyVoltageUnderLoad([v, supplyUnderLoadS, supplyUnderLoadT].join('&'))}
            suffixText="V"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 16 }} />

          <MaskedInput
            placeholder="Digite o S"
            value={supplyUnderLoadS}
            onChangeText={(v) => setRrSupplyVoltageUnderLoad([supplyUnderLoadR, v, supplyUnderLoadT].join('&'))}
            suffixText="V"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 16 }} />

          <MaskedInput
            placeholder="Digite o T"
            value={supplyUnderLoadT}
            onChangeText={(v) => setRrSupplyVoltageUnderLoad([supplyUnderLoadR, supplyUnderLoadS, v].join('&'))}
            suffixText="V"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Tensão da rede elétrica em alívio"
            placeholder="Digite o R"
            value={supplyUnloadedR}
            onChangeText={(v) => setRrSupplyVoltageUnloaded([v, supplyUnloadedS, supplyUnloadedT].join('&'))}
            suffixText="V"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 16 }} />

          <MaskedInput
            placeholder="Digite o S"
            value={supplyUnloadedS}
            onChangeText={(v) => setRrSupplyVoltageUnloaded([supplyUnloadedR, v, supplyUnloadedT].join('&'))}
            suffixText="V"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 16 }} />

          <MaskedInput
            placeholder="Digite o T"
            value={supplyUnloadedT}
            onChangeText={(v) => setRrSupplyVoltageUnloaded([supplyUnloadedR, supplyUnloadedS, v].join('&'))}
            suffixText="V"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Corrente do motor elétrico com fator de serviço"
            placeholder="Digite a corrente"
            value={rrServiceFactorCurrent}
            onChangeText={setRrServiceFactorCurrent}
            suffixText="A"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Corrente elétrica com carga"
            placeholder="Digite a corrente elétrica com carga"
            value={rrElectricalCurrentUnderLoad}
            onChangeText={setRrElectricalCurrentUnderLoad}
            suffixText="A"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Corrente elétrica em alívio"
            placeholder="Digite a corrente elétrica em alívio"
            value={rrElectricalCurrentUnloaded}
            onChangeText={setRrElectricalCurrentUnloaded}
            suffixText="A"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Corrente elétrica do motor do ventilador"
            placeholder="Digite a corrente"
            value={rrFanMotorCurrent}
            onChangeText={setRrFanMotorCurrent}
            suffixText="A"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Temperatura de trabalho do compressor"
            placeholder="Digite a temperatura"
            value={rrCompressorOperatingTemperature}
            onChangeText={setRrCompressorOperatingTemperature}
            suffixText="°C"
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Corrente elétrica do secador"
            placeholder="Digite a corrente elétrica do secador"
            value={rrDryerCurrent}
            onChangeText={setRrDryerCurrent}
            suffixText="A"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Temperatura do ponto de orvalho"
            placeholder="Digite a temperatura do ponto de orvalho"
            value={rrDewPointTemperature}
            onChangeText={setRrDewPointTemperature}
            suffixText="°C"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <MaskedInput
            label="Temperatura ambiente"
            placeholder="Digite a temperatura ambiente"
            value={rrAmbientTemperature}
            onChangeText={setRrAmbientTemperature}
            suffixText="°C"
            mask={(v) => Array(String(v ?? '').length).fill(/[0-9.,;\/-]/)}
            keyboardType="number-pad"
          />

          <View style={{ height: 32 }} />

          <Button title="Salvar" onPress={handleSave} style={{ marginTop: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}