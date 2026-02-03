import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/Button";
import { generatePDF } from 'react-native-html-to-pdf';
import styles from "./style";
import { Ionicons } from "@expo/vector-icons"; 7
import { useCallback, useEffect, useRef, useState } from "react";
import { getOrderServiceById } from "../../../storage/order_service";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { isConnectedNetwork } from "../../../util/network";
import { reportsService } from "../../../service/reports";
import Toast from "react-native-toast-message";
import { reportTemplate } from "../../../../templates/reportTemplate";
import { formatDate, formatDateTime } from "../../../util/date";
import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import InfoBanner from "../../../components/InfoBanner";
import BottomSheetComponent from "../../../components/BottomSheet";
import LottieView from "lottie-react-native";
import { updateReport } from "../../../storage/report";

export default function AddReportOrderService({ navigation, route }) {
  const id = route?.params?.id || null;
  const idReport = route?.params?.idReport || null;

  const [companyName, setCompanyName] = useState(null);
  const [equipamentName, setEquipamentName] = useState(null);
  const [osNumber, setOsNumber] = useState(null);

  const orderService = useRef({});
  const loadingSheetRef = useRef(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  useFocusEffect(
    useCallback(() => {
      start()
    }, [])
  )

  const start = async () => {
    const response = await getOrderServiceById(idReport);

    if (response) {
      orderService.current = response;
      setCompanyName(response?.company?.name);
      setEquipamentName(response?.equipament?.name);
      setOsNumber(response?.OS_number);
    }
  }

  const getLogoFileUri = async () => {
    const asset = Asset.fromModule(
      require('../../../../assets/logos/GGA.jpg')
    );
  
    await asset.downloadAsync();
  
    const target = FileSystem.documentDirectory + 'logo.jpg';
  
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: target,
    });
  
    return target;
  }

  const handleGeneratePDF = async () => {
    let dateStartFormatted = formatDateTime(orderService.current?.closing_start_time);
    let dateEndFormatted = formatDateTime(orderService.current?.closing_end_time);

    const replaceAmpWithOu = (value) => {
      if (value == null || value === '') return value;
      const parts = String(value).split('&').map(p => (p || '').trim()).filter(Boolean);
      if (parts.length === 0) return null;
      return parts.join(' ou ');
    };

    if (dateStartFormatted) {
      orderService.current.closing_start_time_1 = dateStartFormatted.split(' ')[0];
      orderService.current.closing_start_time_2 = dateStartFormatted.split(' ')[1];
    }

    if (dateEndFormatted) {
      orderService.current.closing_end_time_1 = dateEndFormatted.split(' ')[0];
      orderService.current.closing_end_time_2 = dateEndFormatted.split(' ')[1];
    }

    if (orderService.current?.equipament?.working_pressure) {
      orderService.current.equipament.working_pressure = orderService.current.equipament.working_pressure + 'Bar';
    }

    if (orderService.current?.rr_oil_stock_quantity) {
      orderService.current.rr_oil_stock_quantity = orderService.current.rr_oil_stock_quantity + 'L';
    }

    if (orderService.current?.rr_service_factor_current) {
      orderService.current.rr_service_factor_current = orderService.current.rr_service_factor_current + 'A';
    }

    if (orderService.current?.rr_electrical_current_under_load) {
      orderService.current.rr_electrical_current_under_load = orderService.current.rr_electrical_current_under_load + 'A';
    }

    if (orderService.current?.rr_electrical_current_unloaded) {
      orderService.current.rr_electrical_current_unloaded = orderService.current.rr_electrical_current_unloaded + 'A';
    }

    if (orderService.current?.rr_fan_motor_current) {
      orderService.current.rr_fan_motor_current = orderService.current.rr_fan_motor_current + 'A';
    }

    if (orderService.current?.rr_compressor_operating_temperature) {
      orderService.current.rr_compressor_operating_temperature = orderService.current.rr_compressor_operating_temperature + '°C';
    }

    if (orderService.current?.rr_dryer_current) {
      orderService.current.rr_dryer_current = orderService.current.rr_dryer_current + 'A';
    }

    if (orderService.current?.rr_dew_point_temperature) {
      orderService.current.rr_dew_point_temperature = orderService.current.rr_dew_point_temperature + '°C';
    }

    if (orderService.current?.rr_ambient_temperature) {
      orderService.current.rr_ambient_temperature = orderService.current.rr_ambient_temperature + '°C';
    }

    const maintenanceFields = [
      'mp_oil',
      'mp_air_oil_separator_element',
      'mp_primary_air_filter',
      'mp_secondary_air_filter',
      'mp_standard_air_filter',
      'mp_oil_filter',
      'mp_engine_lubricant',
      'mp_coalescing_element',
      'mp_compressor_element_revision',
    ];

    maintenanceFields.forEach((field) => {
      orderService.current[field] = replaceAmpWithOu(orderService.current[field]);
    });

    const toTopicsHtml = (text) => {
      if (text == null) return text;
      
      const str = String(text).trim();

      if (str.length === 0) return text;

      if (str.includes('<ul class="topics">')) return str;

      let normalized = str.replace(/\r\n/g, '\n');
      normalized = normalized.replace(/\s*;\s*/g, '\n');
      normalized = normalized.replace(/\s[-*•]\s+/g, '\n');
      normalized = normalized.replace(/(^|\n)\s*[-*•]\s*/g, '$1');

      const ensureDot = (s) => (s.endsWith('.') ? s : `${s}.`);

      const parts = normalized
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(ensureDot);

      if (parts.length === 0) return text;
      return `<ul class="topics">${parts.map(p => `<li>${p}</li>`).join('')}</ul>`;
    };

    const topicFields = [
      'cga_reason_visit',
      'cga_reported_defect',
      'cga_probable_cause',
      'cga_solution_applied',
      'cga_replaced_parts',
      'cga_parts_to_replace',
    ];

    console.log('cga_solution_applied', orderService.current.cga_solution_applied);

    topicFields.forEach((field) => {
      orderService.current[field] = toTopicsHtml(orderService.current[field]);
    });

  const splitRST = (value) => {
    if (value == null || value === '') return ['', '', ''];
    const parts = String(value).split('&');
    return [(parts[0] || '').trim(), (parts[1] || '').trim(), (parts[2] || '').trim()];
  };

  const withUnitOrNA = (v, unit) => (v ? `${v}${unit}` : 'N/A');

  {
    const [r, s, t] = splitRST(orderService.current?.rr_supply_voltage_under_load);
    orderService.current.rr_supply_voltage_under_load_R = withUnitOrNA(r, 'V');
    orderService.current.rr_supply_voltage_under_load_S = withUnitOrNA(s, 'V');
    orderService.current.rr_supply_voltage_under_load_T = withUnitOrNA(t, 'V');
  }

  {
    const [r, s, t] = splitRST(orderService.current?.rr_supply_voltage_unloaded);

    orderService.current.rr_supply_voltage_unloaded_R = withUnitOrNA(r, 'V');
    orderService.current.rr_supply_voltage_unloaded_S = withUnitOrNA(s, 'V');
    orderService.current.rr_supply_voltage_unloaded_T = withUnitOrNA(t, 'V');
  }
    
    let logoUri = null;

    try {
      logoUri = await getLogoFileUri();
    } catch (_e) {
      console.log('[x] - Erro ao carregar logo', _e);
    }

    const dto = { ...orderService.current, logo: logoUri };

    const html = reportTemplate(dto);

    const options = {
      html: html,
      fileName: `ordem_service_${orderService.current.id}`
    }

    const { filePath } = await generatePDF(options);

    navigation.navigate('PreviewPDF', { pdfPath: filePath });
  }

  const handleSync = async () => {
    console.log("[x] - Sincronizando...");
    const startAt = Date.now();
    setSyncStatus('loading');
    loadingSheetRef.current?.expand();

    const isConnected = await isConnectedNetwork();

    if (!isConnected) {
      setSyncStatus('error');
      setTimeout(() => loadingSheetRef.current?.close(), 1200);
      return;
    }

    const requestReport = {
      id: id,
      id_reference: idReport,
      type: "ORDEM_SERVICE",
    }

    const response = await reportsService.addReport(requestReport);

    const finish = (status) => {
      const elapsed = Date.now() - startAt;
      const wait = elapsed < 900 ? 900 - elapsed : 0; // mínima de ~900ms antes de trocar estado
      setTimeout(() => {
        setSyncStatus(status);
        setTimeout(() => loadingSheetRef.current?.close(), 1100);
      }, wait);
    };

    if (response.success) {
      const requestReference = {
        id: idReport,
        order_service: {
          ...orderService.current,
          id_company: orderService.current?.company?.id,
          id_equipament: orderService.current?.equipament?.id,
        }
      }

      if (response.is_exists) {
        const requestReference = {
          id: idReport,
          order_service: {
            ...orderService.current,
            id_company: orderService.current?.company?.id,
            id_equipament: orderService.current?.equipament?.id,
          }
        }

        const responseReference = await reportsService.putReportReference(requestReference);

        if (responseReference.success) {
          await updateReport(idReport, { sync: true });
        }

        finish(responseReference.success ? 'success' : 'error');

        return;
      }

      const responseReference = await reportsService.addReportReference(requestReference);

      if (responseReference.success) {
        await updateReport(idReport, { sync: true });
      }

      finish(responseReference.success ? 'success' : 'error');
    } else {
      finish('error');
    }
  }

  const handleSignature = () => {
    navigation.navigate('Signature', { id: idReport, orderService: orderService.current });
  }

  const CardTopic = ({ title, subtitle, onPress, isLast = false, iconName = "document-text-outline" }) => {
    return (
      <>
        <TouchableOpacity style={styles.cardTopic} onPress={onPress} activeOpacity={0.7}>
          <View style={styles.cardIcon}>
            <Ionicons name={iconName} size={18} color="rgba(8, 36, 129, 0.98)" />
          </View>
          <View style={styles.topicTextContainer}>
            <Text style={styles.titleCardTopic}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitleCardTopic} numberOfLines={1}>{subtitle}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={24} color="rgba(8, 36, 129, 0.98)" />
        </TouchableOpacity>

        {!isLast && <View style={styles.cardLineSeparator} />}
      </>
    )
  }

  const goTo = (nameNavigation, params) => {
    if (nameNavigation != 'DataCompany' && params.orderService.company == null) {
      Toast.show({
        text1: "Selecione uma empresa para continuar!",
        type: "warning",
      });

      return
    }

    navigation.navigate(nameNavigation, params);
  }

  return (
    <>
    <ScrollView style={styles.container}>
      <InfoBanner
        storageKey="@banner_order_overview"
        message="Complete as seções abaixo para gerar o relatório. Campos com sufixo serão ajustados automaticamente no PDF."
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Ionicons name="pricetag-outline" size={18} color="#0c2168" />
          <Text style={styles.summaryLabel}>O.S.</Text>
          <Text style={styles.summaryValue}>{osNumber ?? '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="business-outline" size={18} color="#0c2168" />
          <Text style={styles.summaryLabel}>Empresa</Text>
          <Text style={styles.summaryValue}>{companyName ?? '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="construct-outline" size={18} color="#0c2168" />
          <Text style={styles.summaryLabel}>Equipamento</Text>
          <Text style={styles.summaryValue}>{equipamentName ?? '—'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preenchimento</Text>
      <CardTopic
        title="Dados da empresa"
        subtitle={companyName ?? 'Selecionar empresa'}
        iconName="business-outline"
        onPress={() => goTo('DataCompany', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Dados do equipamento"
        subtitle={equipamentName ?? 'Selecionar equipamento'}
        iconName="construct-outline"
        onPress={() => goTo('DataEquipament', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Considerações gerais de atendimento"
        subtitle="Toque para preencher"
        iconName="chatbubbles-outline"
        onPress={() => goTo('DataGeneralServiceNotes', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Planos de manutenção"
        subtitle="Toque para preencher"
        iconName="clipboard-outline"
        onPress={() => goTo('DataMaintenancePlans', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Leituras obrigatórias"
        subtitle="Toque para preencher"
        iconName="pulse-outline"
        onPress={() => goTo('DataRequiredReadings', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Sala de geração do ar comprimido"
        subtitle="Toque para preencher"
        iconName="home-outline"
        onPress={() => goTo('DataCompressedAirGenerationRoom', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Informações de encerramento"
        subtitle="Toque para preencher"
        iconName="time-outline"
        onPress={() => goTo('DataClosureInformation', { id: idReport, orderService: orderService.current })}
      />
      <CardTopic
        title="Anexos"
        subtitle="Fotos e outros arquivos"
        iconName="images-outline"
        onPress={() => goTo('DataAttachments', { id: idReport, orderService: orderService.current })}
        isLast={true}
      />

      <View style={styles.actionsBlock}>
        <Button title="Assinatura do cliente" onPress={handleSignature} variant="secondary" leftIcon={<Ionicons name="create-outline" size={24} color="white" />} />
        <View style={{ height: 12 }} />
        <Button title="Gerar PDF" onPress={handleGeneratePDF} variant="secondary" leftIcon={<Ionicons name="document-text-outline" size={24} color="white" />} />
        <View style={{ height: 12 }} />
        <Button title="Sincronizar" onPress={handleSync} leftIcon={<Ionicons name="sync-outline" size={24} color="white" />} />
      </View>

      <View style={{ height: 64 }} />
    </ScrollView>

    <BottomSheetComponent
      bottomSheetRef={loadingSheetRef}
      title={syncStatus === 'loading' ? 'Sincronizando' : syncStatus === 'success' ? 'Concluído' : 'Falhou'}
    >
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        {syncStatus === 'loading' && (
          <LottieView
            source={require('../../../../assets/animations/loading_sync.json')}
            autoPlay
            loop
            style={{ width: 140, height: 140 }}
          />
        )}
        {syncStatus === 'success' && (
          <LottieView
            source={require('../../../../assets/animations/success_sync.json')}
            autoPlay
            loop={false}
            style={{ width: 140, height: 140 }}
          />
        )}
        {syncStatus === 'error' && (
          <LottieView
            source={require('../../../../assets/animations/error_sync.json')}
            autoPlay
            loop={false}
            style={{ width: 140, height: 140 }}
          />
        )}
        <Text style={{ marginTop: 8, fontFamily: 'Inter-Regular', color: '#333' }}>
          {syncStatus === 'loading'
            ? 'Enviando dados...'
            : syncStatus === 'success'
            ? 'Dados sincronizados com sucesso!'
            : 'Ocorreu um erro na sincronização.'}
        </Text>
      </View>
    </BottomSheetComponent>
    </>
  )
} 