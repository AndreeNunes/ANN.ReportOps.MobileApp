import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import SegmentedRadio from "../../../../../components/SegmentedRadio";
import TextInput from "../../../../../components/TextInput";
import Button from "../../../../../components/Button";
import { useEffect, useState } from "react";
import styles from "./styles";
import { updateOrderService } from "../../../../../storage/order_service";
import { updateReport } from "../../../../../storage/report";

export default function DataCompressedAirGenerationRoom({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [crHotAirDuctOk, setCrHotAirDuctOk] = useState(null);
  const [crHotAirDuctRegularized, setCrHotAirDuctRegularized] = useState(null);
  const [crRoomTempVentOk, setCrRoomTempVentOk] = useState(null);
  const [crRoomNotes, setCrRoomNotes] = useState(null);
  const [crInstallEnvCondition, setCrInstallEnvCondition] = useState(null);
  const [crAccidentRisk, setCrAccidentRisk] = useState(null);
  const [crElectricalInstallOk, setCrElectricalInstallOk] = useState(null);
  const [crGroundingOk, setCrGroundingOk] = useState(null);
  const [crRoomLightingOk, setCrRoomLightingOk] = useState(null);
  const [crServiceOutlet220v, setCrServiceOutlet220v] = useState(null);
  const [crAirPointForCleaning, setCrAirPointForCleaning] = useState(null);
  const [crWaterPointAvailable, setCrWaterPointAvailable] = useState(null);
  const [crDistancingOk, setCrDistancingOk] = useState(null);
  const [crCompressorOk, setCrCompressorOk] = useState(null);
  const [crImprovementSuggestions, setCrImprovementSuggestions] = useState(null);

  useEffect(() => {
    if (orderService) {
      setCrHotAirDuctOk(orderService.cr_hot_air_duct_ok);
      setCrHotAirDuctRegularized(orderService.cr_hot_air_duct_regularized);
      setCrRoomTempVentOk(orderService.cr_room_temp_vent_ok);
      setCrRoomNotes(orderService.cr_room_notes);
      setCrInstallEnvCondition(orderService.cr_install_env_condition);
      setCrAccidentRisk(orderService.cr_accident_risk);
      setCrElectricalInstallOk(orderService.cr_electrical_install_ok);
      setCrGroundingOk(orderService.cr_grounding_ok);
      setCrRoomLightingOk(orderService.cr_room_lighting_ok);
      setCrServiceOutlet220v(orderService.cr_service_outlet_220v);
      setCrAirPointForCleaning(orderService.cr_air_point_for_cleaning);
      setCrWaterPointAvailable(orderService.cr_water_point_available);
      setCrDistancingOk(orderService.cr_distancing_ok);
      setCrCompressorOk(orderService.cr_compressor_ok);
      setCrImprovementSuggestions(orderService.cr_improvement_suggestions);
    }
  }, [orderService]);

  const handleSave = async () => {
    if (!id) {
      return;
    }

    await updateOrderService(id, {
      cr_hot_air_duct_ok: crHotAirDuctOk,
      cr_hot_air_duct_regularized: crHotAirDuctRegularized,
      cr_room_temp_vent_ok: crRoomTempVentOk,
      cr_room_notes: crRoomNotes,
      cr_install_env_condition: crInstallEnvCondition,
      cr_accident_risk: crAccidentRisk,
      cr_electrical_install_ok: crElectricalInstallOk,
      cr_grounding_ok: crGroundingOk,
      cr_room_lighting_ok: crRoomLightingOk,
      cr_service_outlet_220v: crServiceOutlet220v,
      cr_air_point_for_cleaning: crAirPointForCleaning,
      cr_water_point_available: crWaterPointAvailable,
      cr_distancing_ok: crDistancingOk,
      cr_compressor_ok: crCompressorOk,
      cr_improvement_suggestions: crImprovementSuggestions,
    });

    await updateReport(id, {
      sync: false,
    });

    navigation.goBack();
  }

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

        <SegmentedRadio
          label="Equipamento possui duto para retirada de ar quente regularizado?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crHotAirDuctOk}
          onChange={(value) => {
            setCrHotAirDuctOk(value);

            if (value === false) {
              setCrHotAirDuctRegularized(null);
            }
          }}
        />

        <View style={{ height: 32 }} />

        {
          crHotAirDuctOk === true && (
            <>
              <SegmentedRadio
                value={crHotAirDuctRegularized}
                onChange={setCrHotAirDuctRegularized}
                label="Duto regularizado?"
                options={[
                  { label: 'SIM', value: true, color: '#16a34a' },
                  { label: 'NÃO', value: false, color: '#dc2626' },
                ]}
              />

              <View style={{ height: 32 }} />
            </>
          )
        }

        <SegmentedRadio
          label="Temperatura e ventilação da sala são adequadas? (A temperatura deve ser até 35°C)"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crRoomTempVentOk}
          onChange={(value) => {
            setCrRoomTempVentOk(value);

            if (value === true) {
              setCrRoomNotes(null);
            }
          }}
        />

        {
          crRoomTempVentOk === false && (
            <>
              <View style={{ height: 32 }} />
              
              <TextInput
                label="Observações"
                placeholder="Digite as observações"
                value={crRoomNotes}
                onChangeText={setCrRoomNotes}
                multiline={true}
                numberOfLines={14}
              />
            </>
          )
        }

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Condições do ambiente de instalação do compressor?"
          options={[
            { label: 'BOA', value: "BOA", color: '#16a34a' },
            { label: 'REGULAR', value: "REGULAR", color: '#f59e0b' },
            { label: 'AGRESSIVA', value: "AGRESSIVO", color: '#dc2626' },
          ]}
          value={crInstallEnvCondition}
          onChange={setCrInstallEnvCondition}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Existe risco de acidente?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crAccidentRisk}
          onChange={setCrAccidentRisk}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Instalação elétrica está adequada?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crElectricalInstallOk}
          onChange={setCrElectricalInstallOk}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Instalação possui aterramento para sua segurança?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crGroundingOk}
          onChange={setCrGroundingOk}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="A sala possui iluminação adequada?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crRoomLightingOk}
          onChange={setCrRoomLightingOk}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Existe tomada de serviço 220V?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crServiceOutlet220v}
          onChange={setCrServiceOutlet220v}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Sala possui ponto de ar com mangueira para limpeza do compressor?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crAirPointForCleaning}
          onChange={setCrAirPointForCleaning}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Sala possui ponto de água com torneira para hidrolavadora?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crWaterPointAvailable}
          onChange={setCrWaterPointAvailable}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Compressor atente os distanciamento exigidos para um bom funcionamento?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crDistancingOk}
          onChange={setCrDistancingOk}
        />

        <View style={{ height: 32 }} />

        <SegmentedRadio
          label="Acesso ao compressor é correto e seguro?"
          options={[
            { label: 'SIM', value: true, color: '#16a34a' },
            { label: 'NÃO', value: false, color: '#dc2626' },
          ]}
          value={crCompressorOk}
          onChange={setCrCompressorOk}
        />

        <View style={{ height: 32 }} />

        <TextInput
          label="Observações"
          placeholder="Digite as observações"
          value={crImprovementSuggestions}
          onChangeText={setCrImprovementSuggestions}
          multiline={true}
          numberOfLines={14}
        />

        <View style={{ height: 32 }} />

        <Button title="Salvar" onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}