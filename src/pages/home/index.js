import React, { useEffect, useMemo, useState, useCallback, useLayoutEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrderService } from '../../storage/order_service';
import { Ionicons } from '@expo/vector-icons';
import SearchWithAdd from '../../components/SearchWithAdd';
import { useIsFocused } from '@react-navigation/native';
import BottomSheetComponent from '../../components/BottomSheet';
import LottieView from 'lottie-react-native';
import { isConnectedNetwork } from '../../util/network';
import { reportsService } from '../../service/reports';
import { addReportFromServer, getReport } from '../../storage/report';
import { getFirstLoginSyncPrompted, setFirstLoginSyncPrompted } from '../../storage/sync_prefs';
import { deleteCompany, getAllCompanies } from '../../service/company';

export default function Home({ navigation }) {
  const maskCnpj = (doc) => {
    if (!doc) return '';
    const v = String(doc).replace(/\D/g, '').slice(0, 14);
    if (v.length <= 2) return v;
    if (v.length <= 5) return v.replace(/^(\d{2})(\d+)/, '$1.$2');
    if (v.length <= 8) return v.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    if (v.length <= 12) return v.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5');
  };
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [countsByCompanyId, setCountsByCompanyId] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const syncSheetRef = useRef(null);
  const actionSheetRef = useRef(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncText, setSyncText] = useState('');
  const [actionItem, setActionItem] = useState(null);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

  const loadCompanies = useCallback(async () => {
    setIsLoading(true);

    const stored = await AsyncStorage.getItem('@companies');
    
    setCompanies(stored ? JSON.parse(stored) : []);

    setIsLoading(false);
    
  }, []);

  const openCompanyActions = (company) => {
    setActionItem(company);
    actionSheetRef.current?.expand?.();
  };

  const closeCompanyActions = () => {
    actionSheetRef.current?.close?.();
    setActionItem(null);
    setIsDeletingCompany(false);
  };

  const handleEditCompany = () => {
    if (!actionItem) return;
    closeCompanyActions();
    navigation.navigate('AddCompany', { company: actionItem, mode: 'edit' });
  };

  const handleDeleteCompany = () => {
    if (!actionItem) return;
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir a empresa "${actionItem?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeletingCompany(true);
              const response = await deleteCompany(actionItem.id);
              if (!response?.success) {
                Alert.alert('Erro', response?.message || 'Não foi possível excluir a empresa.');
                setIsDeletingCompany(false);
                return;
              }

              try {
                await getAllCompanies();
              } catch {}

              await loadCompanies();
              await loadCounts();
              closeCompanyActions();
            } catch (e) {
              setIsDeletingCompany(false);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir a empresa.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const loadCounts = useCallback(async () => {
    const osList = await getOrderService();
    const map = {};

    for (const os of osList || []) {
      const id = os?.company?.id;
      if (!id) continue;
      map[id] = (map[id] || 0) + 1;
    }

    setCountsByCompanyId(map);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadCompanies();
      loadCounts();
      
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
  }, [isFocused, loadCompanies, loadCounts]);

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

  const handleSyncFromServer = async () => {
    const isConnected = await isConnectedNetwork();

    if (!isConnected) {
      Alert.alert('Sem conexão', 'Conecte-se à internet para sincronizar.');

      return;
    }

    syncSheetRef.current?.expand();

    setSyncStatus('loading');

    try {
      setSyncText(`Sincronizando relatórios...`);

      const allReports = [];
      let page = 1;
      let limit = 40;

      while (true) {
        const refsResp = await reportsService.getSyncReports({ page, limit });
        
        if (!refsResp.success) {
          throw new Error(refsResp.message || 'Falha ao buscar relatórios sincronizados.');
        }

        if (refsResp.data.length === 0) {
          break;
        }

        allReports.push(...refsResp.data);

        page++;        
      }

      const existingReports = await getReport();

      for (const report of allReports) {
        await addReportFromServer(report, existingReports);
      }

      setSyncText(`Relatórios sincronizados com sucesso.`);
      setSyncStatus('success');

      await loadCounts();
    
      setTimeout(() => {
        syncSheetRef.current?.close();
      }, 800);

    } catch (e) {
      setSyncText(e?.message || 'Erro durante a sincronização.');
      setSyncStatus('error');
    }
  };

  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return companies;
    return (companies || []).filter(c => (c?.name || '').toLowerCase().includes(q));
  }, [companies, search]);

  const openCompanyReports = (company) => {
    navigation.navigate('Reports', {
      filterCompanyId: company?.id,
      filterCompanyName: company?.name,
      filterCompany: company,
    });
  };

  const renderItem = ({ item }) => {
    const count = countsByCompanyId[item?.id] || 0;
    return (
      <TouchableOpacity
        style={styles.companyCard}
        activeOpacity={0.8}
        onPress={() => openCompanyReports(item)}
        onLongPress={() => openCompanyActions(item)}
      >
        <View style={styles.companyIcon}>
          <Ionicons name="business-outline" size={18} color="rgba(8, 36, 129, 0.98)" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.companyName} numberOfLines={1}>{item?.name || '-'}</Text>
          {!!item?.document && <Text style={styles.companyDoc}>{maskCnpj(item.document)}</Text>}
        </View>
        <View style={styles.countChip}>
          <Ionicons name="document-text-outline" size={12} color="#1E3A8A" />
          <Text style={styles.countChipText}>{count}</Text>
        </View>
        <Ionicons style={{ marginLeft: 8 }} name="chevron-forward" size={20} color="rgba(8, 36, 129, 0.98)" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <SearchWithAdd
          value={search}
          onChangeText={setSearch}
          onSearch={() => {}}
          onAdd={() => navigation.navigate('AddCompany')}
          placeholder="Pesquisar empresas"
          isAddButton={true}
        />
      </View>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#082481" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={(
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Ionicons name="search-outline" size={64} color="rgba(17, 17, 104, 0.98)" />
              <Text style={{ marginTop: 8, fontFamily: 'Inter-SemiBold', color: '#111827' }}>
                Nenhuma empresa encontrada
              </Text>
            </View>
          )}
          onRefresh={() => { loadCompanies(); loadCounts(); }}
          refreshing={isLoading}
        />
      )}
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

      <BottomSheetComponent bottomSheetRef={actionSheetRef} title="Gerenciar empresa">
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEditCompany}
            disabled={isDeletingCompany}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="create-outline" size={22} color="rgba(8, 36, 129, 0.98)" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#111827' }}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDeleteCompany}
            disabled={isDeletingCompany}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="trash-outline" size={22} color="#DC2626" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#DC2626' }}>
              {isDeletingCompany ? 'Excluindo...' : 'Excluir'}
            </Text>
            {isDeletingCompany && (
              <ActivityIndicator style={{ marginLeft: 8 }} size="small" color="#DC2626" />
            )}
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>
    </View>
  );
}
