import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import BottomSheetComponent from '../../components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { addReport, getReport, addReportFromServer } from '../../storage/report';
import { duplicateReport, removeReport } from '../../storage/report';
import { formatDateTime } from '../../util/date';
import SearchWithAdd from '../../components/SearchWithAdd';
import InfoBanner from '../../components/InfoBanner';
import LottieView from 'lottie-react-native';
import { isConnectedNetwork } from '../../util/network';
import { reportsService } from '../../service/reports';
import { getFirstLoginSyncPrompted, setFirstLoginSyncPrompted } from '../../storage/sync_prefs';

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
  const [filterMode, setFilterMode] = useState('all');
  const syncSheetRef = useRef(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [syncText, setSyncText] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const selectedCount = selectedIds.size;

  useEffect(() => {
    if (isFocused) {
      start();
      (async () => {
        const prompted = await getFirstLoginSyncPrompted();
        if (!prompted) {
          Alert.alert(
            'Sincronizar agora?',
            'Deseja sincronizar seus relatórios do servidor neste dispositivo?',
            [
              { text: 'Agora não', style: 'cancel', onPress: async () => {
                await setFirstLoginSyncPrompted(true);
              }},
              { text: 'Sim, sincronizar', onPress: async () => {
                await setFirstLoginSyncPrompted(true);
                handleSyncFromServer();
              }},
            ]
          );
        }
      })();
    }
    
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSyncFromServer}
          style={{ paddingRight: 12, paddingVertical: 6 }}
          activeOpacity={0.8}
        >
          <Ionicons name="sync-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const start = async () => {
    setIsLoading(true);

    const response = await getReport();

    setReports(response);

    setIsLoading(false);
  }

  const handleSyncFromServer = async () => {
    const isConnected = await isConnectedNetwork();
    
    if (!isConnected) {
      Alert.alert('Sem conexão', 'Conecte-se à internet para sincronizar.');
      return;
    }

    try {
      setSyncStatus('loading');
      setSyncText('Buscando IDs de relatórios...');
      syncSheetRef.current?.expand();

      const idsResp = await reportsService.getReportIds();
      if (!idsResp.success) {
        throw new Error(idsResp.message || 'Falha ao buscar IDs');
      }

      const serverIds = Array.isArray(idsResp.data) ? idsResp.data : [];
      const local = await getReport();
      const localSyncedIds = new Set(
        (local || [])
          .filter(r => r?.sync && r?.remote_id)
          .map(r => r.remote_id)
      );

      const idsToFetch = serverIds.filter(id => !localSyncedIds.has(id));

      if (!idsToFetch.length) {
        setSyncText('Nenhum novo relatório para importar.');
        setSyncStatus('success');
        setTimeout(() => {
          syncSheetRef.current?.close();
        }, 1200);
        return;
      }

      setSyncText(`Baixando ${idsToFetch.length} relatório(s)...`);
      const refsResp = await reportsService.getReportsByIds(idsToFetch);
      if (!refsResp.success) {
        throw new Error(refsResp.message || 'Falha ao buscar relatórios por IDs');
      }

      const items = Array.isArray(refsResp.data) ? refsResp.data : [];
      let imported = 0;
      for (const item of items) {
        await addReportFromServer(item);
        imported += 1;
      }

      setSyncText(`Importados ${imported} relatório(s) com sucesso.`);
      setSyncStatus('success');
      await start();
      setTimeout(() => {
        syncSheetRef.current?.close();
      }, 1200);
    } catch (e) {
      setSyncText(e?.message || 'Erro durante a sincronização.');
      setSyncStatus('error');
    }
  };

  const goToReportOrderService = async () => {
    console.log("[x] - Adicionando relatório...")

    const report = await addReport();

    sheetRef.current?.close();
    
    navigation.navigate('ReportOrderService', { id: report.id, idReport: report.id_report });
  }

  const enterSelectionModeWith = (id) => {
    setIsSelectionMode(true);
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isSelectionMode && selectedIds.size === 0) {
      setIsSelectionMode(false);
    }
  }, [selectedIds, isSelectionMode]);

  const clearSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const confirmDeleteSelected = () => {
    if (!selectedCount) return;
    Alert.alert(
      'Excluir selecionados',
      `Tem certeza que deseja excluir ${selectedCount} relatório(s)? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const ids = Array.from(selectedIds);
            try {
              const isConnected = await isConnectedNetwork();
              
              if (!isConnected) {
                Alert.alert('Sem conexão', 'Conecte-se à internet para excluir no servidor.');
                return;
              }

              setIsLoading(true);
              
              const resp = await reportsService.bulkDelete(ids);
              
              if (!resp.success) {
                setIsLoading(false);
                Alert.alert('Erro', resp.message || 'Falha ao excluir no servidor.');
                return;
              }

              for (const id of ids) {
                try {
                  await removeReport(id);
                } catch {}
              }

              clearSelection();

              await start();

            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

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
      
      {isSelectionMode && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionBarCount}>
            {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={clearSelection} activeOpacity={0.8} style={styles.selectionBarCancel}>
              <Ionicons name="close-outline" size={18} color="#374151" />
              <Text style={styles.selectionBarCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDeleteSelected} activeOpacity={0.8} style={styles.selectionBarDelete}>
              <Ionicons name="trash-outline" size={18} color="#B91C1C" />
              <Text style={styles.selectionBarDeleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  ), [search, filterMode, isSelectionMode, selectedCount]);

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.cardReport, isSelected && styles.cardSelected]}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelect(item.id);
          } else {
            navigation.navigate('ReportOrderService', { id: item.id, idReport: item.id_report });
          }
        }}
        onLongPress={() => {
          setActionItem(item);
          actionSheetRef.current?.expand();
        }}
        activeOpacity={0.8}
      >
        <View style={styles.cardIcon}>
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={18} color="rgba(8, 36, 129, 0.98)" />
          ) : (
            <Ionicons name="document-text-outline" size={18} color="rgba(8, 36, 129, 0.98)" />
          )}
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>OS: {item?.OS_number || '-'}</Text>
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
          <View style={[styles.syncChip, item?.sync ? styles.syncChipOk : styles.syncChipNo, styles.syncChipBelow]}>
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
    <View style={styles.container}>
      {!isLoading && !error && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={data}
          ListHeaderComponent={(
            <View style={{ marginBottom: 12 }}>
              <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
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
            onPress={() => {
              if (!actionItem) return;
              enterSelectionModeWith(actionItem.id);
              actionSheetRef.current?.close();
            }}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="rgba(8, 36, 129, 0.98)" />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Selecionar</Text>
          </TouchableOpacity>

          <View style={{ height: 8 }} />

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
                      try {
                        const isConnected = await isConnectedNetwork();
                        if (!isConnected) {
                          Alert.alert('Sem conexão', 'Conecte-se à internet para excluir no servidor.');
                          return;
                        }
                        setIsLoading(true);
                        const resp = await reportsService.bulkDelete([actionItem.id]);
                        if (!resp.success) {
                          setIsLoading(false);
                          Alert.alert('Erro', resp.message || 'Falha ao excluir no servidor.');
                          return;
                        }
                        await removeReport(actionItem.id);
                        actionSheetRef.current?.close();
                        await start();
                      } finally {
                        setIsLoading(false);
                      }
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

      <BottomSheetComponent
        bottomSheetRef={syncSheetRef}
        title={syncStatus === 'loading' ? 'Sincronizando' : syncStatus === 'success' ? 'Concluído' : 'Falhou'}
      >
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          {syncStatus === 'loading' && (
            <LottieView
              source={require('../../../assets/animations/loading_sync.json')}
              autoPlay
              loop
              style={{ width: 140, height: 140 }}
            />
          )}
          {syncStatus === 'success' && (
            <LottieView
              source={require('../../../assets/animations/success_sync.json')}
              autoPlay
              loop={false}
              style={{ width: 140, height: 140 }}
            />
          )}
          {syncStatus === 'error' && (
            <LottieView
              source={require('../../../assets/animations/error_sync.json')}
              autoPlay
              loop={false}
              style={{ width: 140, height: 140 }}
            />
          )}
          <Text style={{ marginTop: 8, fontFamily: 'Inter-Regular', color: '#333' }}>
            {syncStatus === 'loading'
              ? (syncText || 'Sincronizando...')
              : syncStatus === 'success'
              ? (syncText || 'Dados sincronizados com sucesso!')
              : (syncText || 'Ocorreu um erro na sincronização.')}
          </Text>
        </View>
      </BottomSheetComponent>
    </View>
  );
};


export default Reports;