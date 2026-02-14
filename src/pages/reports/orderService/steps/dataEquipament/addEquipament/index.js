import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import TextInput from "../../../../../../components/TextInput";
import styles from "../styles";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../../../components/Button";
import { createEquipaments, updateEquipament } from "../../../../../../service/equipament";
import SegmentedRadio from "../../../../../../components/SegmentedRadio";
import MaskedInput from "../../../../../../components/MaskedInput";
import InfoBanner from "../../../../../../components/InfoBanner";
import Toast from "react-native-toast-message";

export default function AddEquipament({ route, navigation }) {
  const companyId = route?.params?.orderService?.company?.id || null;
  const equipament = route?.params?.equipament || null;
  const isEdit = route?.params?.mode === 'edit' || !!equipament;

  const [eqEquipment, setEqEquipment] = useState(equipament?.name ?? null);
  const [eqManufactureDate, setEqManufactureDate] = useState(equipament?.manufacture_date ?? null);
  const [eqCompressorUnitModel, setEqCompressorUnitModel] = useState(equipament?.compressor_unit_model ?? null);
  const [eqIhmModel, setEqIhmModel] = useState(equipament?.ihm_model ?? null);
  const [eqSupplyVoltage, setEqSupplyVoltage] = useState(equipament?.supply_voltage ?? null);
  const [eqIntakeSolenoidVoltage, setEqIntakeSolenoidVoltage] = useState(equipament?.intake_solenoid_voltage ?? null);
  const [eqCurrentHourMeter, setEqCurrentHourMeter] = useState(equipament?.current_hour_meter ?? null);
  const [eqSerialNumber, setEqSerialNumber] = useState(equipament?.serial_number ?? null);
  const [eqInverterSoftstarterBrandModel, setEqInverterSoftstarterBrandModel] = useState(equipament?.inverter_softstarter_brand_model ?? null);
  const [eqWorkingPressure, setEqWorkingPressure] = useState(equipament?.working_pressure ?? null);
  const [eqControlVoltage, setEqControlVoltage] = useState(equipament?.control_voltage ?? null);
  const [eqMotorLubricationData, setEqMotorLubricationData] = useState(equipament?.motor_lubrication_data ?? null);
  const [eqCoalescingFilterModel, setEqCoalescingFilterModel] = useState(equipament?.coalescing_filter_model ?? null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    if (eqEquipment === null || eqEquipment === '' || eqEquipment === undefined) {
      Toast.show({
        text1: 'Atenção',
        text2: 'O nome do equipamento é obrigatório',
        type: 'warning',
      });

      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        id: equipament?.id,
        name: eqEquipment,
        manufacture_date: eqManufactureDate,
        compressor_unit_model: eqCompressorUnitModel,
        ihm_model: eqIhmModel,
        supply_voltage: eqSupplyVoltage,
        intake_solenoid_voltage: eqIntakeSolenoidVoltage,
        current_hour_meter: eqCurrentHourMeter,
        serial_number: eqSerialNumber,
        inverter_softstarter_brand_model: eqInverterSoftstarterBrandModel,
        working_pressure: eqWorkingPressure,
        control_voltage: eqControlVoltage,
        motor_lubrication_data: eqMotorLubricationData,
        coalescing_filter_model: eqCoalescingFilterModel
      };

      const response = isEdit
        ? await updateEquipament(companyId, payload)
        : await createEquipaments(companyId, payload);

      if (response?.success) {
        Toast.show({
          text1: 'Sucesso',
          text2: isEdit ? 'Equipamento atualizado com sucesso!' : 'Equipamento adicionado com sucesso!',
          type: 'success',
        });
        navigation.goBack();
      } else {
        Toast.show({
          text1: 'Erro',
          text2: isEdit ? 'Não foi possível atualizar o equipamento.' : 'Não foi possível adicionar o equipamento.',
          type: 'error',
        });
      }
    } catch (e) {
      Toast.show({
        text1: 'Erro',
        text2: isEdit ? 'Ocorreu um erro inesperado ao atualizar o equipamento.' : 'Ocorreu um erro inesperado ao adicionar o equipamento.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

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
          message="Todos os sufixos serão atribuídos automaticamente no relatório."
        />

        <View style={{ height: 16 }} />

        <MaskedInput
          label="Horímetro atual"
          placeholder="Digite o horímetro atual"
          useNumberMask={true}
          numberOptions={{
            prefix: [],
            delimiter: '.',
            separator: ',',
            precision: 0,
          }}
          value={eqCurrentHourMeter}
          onChangeText={setEqCurrentHourMeter}
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Equipamento"
          placeholder="Digite o nome do equipamento"
          value={eqEquipment}
          onChangeText={setEqEquipment}
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Data de fabricação"
          placeholder="Digite a data de fabricação"
          value={eqManufactureDate}
          onChangeText={setEqManufactureDate}
          pattern={"##/####"}
          hint="*Ex: MM/AAAA - (01/2026)"
          keyboardType="numeric"
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Modelo do compressor"
          placeholder="Digite o modelo do compressor"
          value={eqCompressorUnitModel}
          onChangeText={setEqCompressorUnitModel}
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Modelo do IHM"
          placeholder="Digite o modelo do IHM"
          value={eqIhmModel}
          onChangeText={setEqIhmModel}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Tensão de alimentação"
          options={[
            { label: '220V', value: '220V' },
            { label: '380V', value: '380V' },
            { label: '440V', value: '440V' },
          ]}
          value={eqSupplyVoltage}
          onChange={setEqSupplyVoltage}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Tensão de entrada do solenóide"
          options={[
            { label: '24V', value: '24V' },
            { label: '110V', value: '110V' },
            { label: '127V', value: '127V' },
            { label: '220V', value: '220V' },
          ]}
          value={eqIntakeSolenoidVoltage}
          onChange={setEqIntakeSolenoidVoltage}
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Número de série"
          placeholder="Digite o número de série"
          value={eqSerialNumber}
          onChangeText={setEqSerialNumber}
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Modelo do inversor"
          placeholder="Digite o modelo do inversor"
          value={eqInverterSoftstarterBrandModel}
          onChangeText={setEqInverterSoftstarterBrandModel}
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Pressão de trabalho"
          placeholder="Digite a pressão de trabalho"
          value={eqWorkingPressure}
          onChangeText={setEqWorkingPressure}
          suffixText="Bar"
          hint="O sufixo 'Bar' será preenchido automaticamente no relatório."
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Dados de lubrificação do motor"
          placeholder="Digite os dados de lubrificação do motor"
          value={eqMotorLubricationData}
          onChangeText={setEqMotorLubricationData}
        />

        <View style={{ height: 32 }} />

        <MaskedInput
          label="Modelo do filtro coalescente"
          placeholder="Digite o modelo do filtro coalescente"
          value={eqCoalescingFilterModel}
          onChangeText={setEqCoalescingFilterModel}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Tensão de comando"
          options={[
            { label: '24V', value: '24V' },
            { label: '110V', value: '110V' },
            { label: '127V', value: '127V' },
            { label: '220V', value: '220V' },
          ]}
          value={eqControlVoltage}
          onChange={setEqControlVoltage}
        />

        <View style={{ height: 32 }} />

        <Button
          title={isEdit ? "Salvar alterações" : "Adicionar equipamento"}
          onPress={handleSave}
          loading={isSaving}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
