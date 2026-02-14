import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { getAllCompanies } from "../../../../../service/company";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { updateOrderService } from "../../../../../storage/order_service";
import SearchWithAdd from "../../../../../components/SearchWithAdd";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../../../components/Button";
import { updateReport } from "../../../../../storage/report";
import InfoBanner from "../../../../../components/InfoBanner";

function DataCompany({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [companySelected, setCompanySelected] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companiesFiltered, setCompaniesFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      start();
    }, [])
  );

  const start = async () => {
    setIsLoading(true);
    setError(null);

    const companies = await getAllCompanies();

    setIsLoading(false);

    if (!companies.success) {
      setError(true);

      return;
    }

    setCompanies(companies.data);
    setCompaniesFiltered(companies.data);

    if (orderService) {
      const findCompany = companies.data.find(company => company.id === orderService.company.id);

      if (findCompany) {
        setCompanySelected(findCompany);
      }

      return;
    }
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await start();
    } finally {
      setRefreshing(false);
    }
  }

  const handleSaveCompany = async (item) => {
    try {
      if (!id) {
        console.log('[x] - ID do relatório não encontrado');

        return;
      }

      setCompanySelected(item);

      await updateOrderService(id, {
        company: item,
        equipament: null,
      });

      await updateReport(id, {
        company_name: item.name,
        sync: false,
      });

      navigation.goBack();
    } catch (error) {
      console.log('[x] - Erro ao salvar empresa', error);
    }

  }

  const searchCompanies = (search) => {
    setSearch(search);

    const filtered = companies.filter(company => company.name.toLowerCase().includes(search.toLowerCase()));

    setCompaniesFiltered(filtered);
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleSaveCompany(item)} style={styles.itemCard} activeOpacity={0.8}>
        <View style={styles.itemContent}>
          <Ionicons name="business-outline" size={22} color="rgba(8, 36, 129, 0.98)" />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <Ionicons
          name={companySelected?.id === item.id ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color="rgba(8, 36, 129, 0.98)"
        />
      </TouchableOpacity>
    )
  }

  const header = useMemo(() => (
    <View style={styles.headerContainer}>
      <InfoBanner
        storageKey="@banner_select_hint"
        message="Dica: pesquise pelo nome e toque para selecionar a empresa."
      />

      <View style={{ height: 12 }} />

      <SearchWithAdd
        value={search}
        onChangeText={searchCompanies}
        onAdd={() => { navigation.navigate('AddCompany', { id, orderService }) }}
        isAddButton={true}
      />
      <Text style={styles.resultsHint}>
        {companiesFiltered.length} resultado{companiesFiltered.length === 1 ? '' : 's'}
      </Text>
    </View>
  ), [search, companiesFiltered.length]);

  const EmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color="rgba(17, 17, 104, 0.98)" />
        <Text style={styles.emptyText}>Nenhuma empresa encontrada</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgba(17, 17, 104, 0.98)" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="rgba(17, 17, 104, 0.98)" />
          <Text style={styles.errorText}>Erro ao buscar empresas</Text>
          <Button title="Tentar novamente" onPress={start} />
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={companiesFiltered}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ListEmptyComponent={EmptyComponent}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  )
}

export default DataCompany;