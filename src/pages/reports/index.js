import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import BottomSheetComponent from '../../components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { addReport, getReport } from '../../storage/report';
import { duplicateReport, removeReport } from '../../storage/report';
import { formatDateTime } from '../../util/date';
import SearchWithAdd from '../../components/SearchWithAdd';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoBanner from '../../components/InfoBanner';

const Reports = ({ navigation }) => { 
  const [reports, setReports] = useState([]);
  const sheetRef = useRef(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [actionItem, setActionItem] = useState(null);
  const actionSheetRef = useRef(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'company' | 'equipament'

  useEffect(() => {
    if (isFocused) start();
    
  }, [isFocused]);

  const start = async () => {
    setIsLoading(true);

    const response = await getReport();

    setReports(response);

    setIsLoading(false);
  }

  const goToReportOrderService = async () => {
    console.log("[x] - Adicionando relatório...")

    const report = await addReport();

    sheetRef.current?.close();
    
    navigation.navigate('ReportOrderService', { id: report.id, idReport: report.id_report });
  }

  const CardType = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.cardTypeContainer} activeOpacity={0.8} onPress={onPress}>
        <View style={styles.cardTypeIcon}>
          <Ionicons name="add-circle-outline" size={18} color="rgba(8, 36, 129, 0.98)" />
        </View>
        <View style={styles.cardTypeContent}>
          <Text style={styles.cardTypeTitle}>Ordem de Serviço</Text>
          <Text style={styles.cardTypeSubtitle}>Criar um novo relatório</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="rgba(8, 36, 129, 0.98)" />
      </TouchableOpacity>
    )
  }

  const RenderAddReport = () => {
    return (
      <View style={styles.addReportContainer}>
        <CardType onPress={goToReportOrderService} />
      </View>
    )
  }

  const listHeaderComponent = React.useMemo(() => (
    <View style={styles.searchWithAddContainer}>
      <SearchWithAdd
        value={search}
        onChangeText={setSearch}
        onSearch={() => {}}
        onAdd={() => sheetRef.current?.expand()}
      />
      <View style={styles.filtersRow}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'company', label: 'Empresa' },
          { key: 'equipament', label: 'Equipamento' },
        ].map(opt => {
          const isActive = filterMode === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setFilterMode(opt.key)}
              activeOpacity={0.8}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* <Button
        title="Adicionar Relatório"
        onPress={() => sheetRef.current?.expand()}
      />

      <Button
        title="CLEAR"
        onPress={() => AsyncStorage.clear()}
      /> */}
    </View>
  ), [search, filterMode]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardReport}
        onPress={() => navigation.navigate('ReportOrderService', { id: item.id, idReport: item.id_report })}
        onLongPress={() => {
          setActionItem(item);
          actionSheetRef.current?.expand();
        }}
        activeOpacity={0.8}
      >
        <View style={styles.cardIcon}>
          <Ionicons name="document-text-outline" size={18} color="rgba(8, 36, 129, 0.98)" />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>OS: {item?.OS_number || '-'}</Text>
            <View style={[styles.syncChip, item?.sync ? styles.syncChipOk : styles.syncChipNo]}>
              <Ionicons
                name={item?.sync ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={12}
                color={item?.sync ? '#1E3A8A' : '#7C2D12'}
              />
              <Text style={[styles.syncChipText, item?.sync ? styles.syncChipTextOk : styles.syncChipTextNo]}>
                {item?.sync ? 'Sincronizado' : 'Não sincronizado'}
              </Text>
            </View>
          </View>
          <View style={styles.cardInfoRow}>
            <Ionicons name="business-outline" size={14} color="#6B7280" />
            <Text style={styles.cardInfoText} numberOfLines={1}>{item?.company_name || '-'}</Text>
          </View>

          <View style={styles.cardInfoRow}>
            <Ionicons name="construct-outline" size={14} color="#6B7280" />
            <Text style={styles.cardInfoText} numberOfLines={1}>{item?.equipament_name || '-'}</Text>
          </View>
          <View style={styles.cardFooterRow}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.textReportSecondary}>{formatDateTime(item?.created_at)}</Text>
          </View>
        </View>
        <Ionicons style={styles.cardChevron} name="chevron-forward" size={22} color="rgba(8, 36, 129, 0.98)" />
      </TouchableOpacity>
    )
  }

  const EmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color="rgba(17, 17, 104, 0.98)" />
        <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
      </View>
    )
  }

  const normalizedSearch = search?.trim().toLowerCase() ?? '';

  const data = React.useMemo(() => {
    if (!normalizedSearch) return reports;
    
    return reports.filter((r) => {
      const company = (r?.company_name ?? '').toLowerCase();
      const equip = (r?.equipament_name ?? '').toLowerCase();
      if (filterMode === 'company') return company.includes(normalizedSearch);
      if (filterMode === 'equipament') return equip.includes(normalizedSearch);
      return company.includes(normalizedSearch) || equip.includes(normalizedSearch);
    });
  }, [reports, normalizedSearch, filterMode]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await start();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isLoading && !error && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          ListHeaderComponent={(
            <View style={{ marginBottom: 24, marginTop: 16 }}>
              <View style={{ paddingHorizontal: 16 }}>
                <InfoBanner
                  storageKey="@banner_reports_hint"
                  message="Pesquise pelo relatório ou crie um novo."
                />
              </View>
              {listHeaderComponent}
            </View>
          )}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyComponent />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      <View style={styles.containerErrorOrLoading}>
        {isLoading && <ActivityIndicator size="large" color="#151D32" />}

        {error && <Text>Ocorreu um erro ao buscar os relatórios</Text>}
      </View>

      <BottomSheetComponent bottomSheetRef={sheetRef} title="Adicionar Relatório">
        <RenderAddReport />
      </BottomSheetComponent>

      <BottomSheetComponent bottomSheetRef={actionSheetRef} title="Ações">
        <View style={{ paddingHorizontal: 8 }}>
          <TouchableOpacity
            onPress={async () => {
              if (!actionItem) return;
              try {
                const newReport = await duplicateReport(actionItem.id);
                actionSheetRef.current?.close();
                if (newReport) {
                  // navegar direto para preenchimento do novo relatório
                  navigation.navigate('ReportOrderService', { id: newReport.id, idReport: newReport.id_report });
                } else {
                  start();
                }
              } catch {
                start();
              }
            }}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="copy-outline" size={20} color="rgba(8, 36, 129, 0.98)" />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Duplicar</Text>
          </TouchableOpacity>

          <View style={{ height: 8 }} />

          <TouchableOpacity
            onPress={async () => {
              if (!actionItem) return;
              Alert.alert(
                'Excluir relatório',
                'Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                      await removeReport(actionItem.id);
                      actionSheetRef.current?.close();
                      start();
                    },
                  },
                ]
              );
            }}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="trash-outline" size={20} color="#B91C1C" />
            <Text style={{ marginLeft: 8, fontSize: 16, color: '#B91C1C' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
};


export default Reports;