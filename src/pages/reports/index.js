import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, SectionList, Text, TouchableOpacity, View, Alert } from 'react-native';
import styles from './styles';
import BottomSheetComponent from '../../components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { addReport, getReport } from '../../storage/report';
import { duplicateReport, removeReport } from '../../storage/report';
import { formatDateTime, formatIsoDateTimeString } from '../../util/date';
import SearchWithAdd from '../../components/SearchWithAdd';
import InfoBanner from '../../components/InfoBanner';
import { isConnectedNetwork } from '../../util/network';
import { reportsService } from '../../service/reports';
import { updateOrderService } from '../../storage/order_service';
import { updateReport } from '../../storage/report';

const Reports = ({ navigation, route }) => { 
  const [reports, setReports] = useState([]);
  const sheetRef = useRef(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [actionItem, setActionItem] = useState(null);
  const actionSheetRef = useRef(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'equipament' | 'os'
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const selectedCount = selectedIds.size;
  const [routeCompany, setRouteCompany] = useState(null);

  useEffect(() => {
    if (isFocused) {
      start();
      // Aplicar filtro vindo da rota (Home)
      const companyFromRoute = route?.params?.filterCompany || null;
      if (companyFromRoute) {
        setRouteCompany(companyFromRoute);
      }
    }
    
  }, [isFocused, route?.params]);

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
    // Se vier da Home com uma empresa selecionada, preenche automaticamente
    if (routeCompany?.id) {
      try {
        // Atualiza OS com a empresa
        await updateOrderService(report.id_report, { company: routeCompany });
        // Atualiza o report com o nome da empresa
        await updateReport(report.id_report, { company_name: routeCompany.name, sync: false });
      } catch {}
    }
    navigation.navigate('ReportOrderService', { id: report.id, idReport: report.id_report, company: routeCompany || null });
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
          { key: 'equipament', label: 'Equipamento' },
          { key: 'os', label: 'Ordem de Serviço' },
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
            <Text style={styles.textReportSecondary}>{formatIsoDateTimeString(item?.created_at)}</Text>
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
    // Primeiro filtra por empresa vinda da Home, se existir
    const base = routeCompany ? reports.filter(r => (r?.company_name || '') === (routeCompany?.name || '')) : reports;
    if (!normalizedSearch) return base;
    return base.filter((r) => {
      const equip = (r?.equipament_name ?? '').toLowerCase();
      const os = String(r?.OS_number ?? '').toLowerCase();
      if (filterMode === 'equipament') return equip.includes(normalizedSearch);
      if (filterMode === 'os') return os.includes(normalizedSearch);
      return equip.includes(normalizedSearch) || os.includes(normalizedSearch);
    });
  }, [reports, normalizedSearch, filterMode, routeCompany]);

  const sections = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      const createdAt = item?.created_at ? new Date(item.created_at) : null;
      const isValidDate = createdAt && !Number.isNaN(createdAt.getTime());
      const key = isValidDate
        ? createdAt.toISOString().slice(0, 10)
        : 'sem-data';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, items]) => {
        const title = key === 'sem-data'
          ? 'Sem data'
          : new Date(`${key}T00:00:00`).toLocaleDateString('pt-BR');
        return {
          title,
          data: items.sort((x, y) => {
            const dx = new Date(x?.created_at || 0).getTime();
            const dy = new Date(y?.created_at || 0).getTime();
            return dy - dx;
          }),
        };
      });
  }, [data]);

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
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
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
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ paddingLeft: 20, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="calendar-outline" size={14} color="#374151" />
                <Text style={{ fontFamily: 'Inter-Bold', color: '#374151', fontSize: 13 }}>
                  {title}
                </Text>
              </View>
            </View>
          )}
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

    </View>
  );
};


export default Reports;