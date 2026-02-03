import { View, Text, FlatList, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Alert } from "react-native";
import { getAllEquipaments, deleteEquipament } from "../../../../../service/equipament";
import { updateOrderService } from "../../../../../storage/order_service";
import { useCallback, useMemo, useRef, useState } from "react";
import Button from "../../../../../components/Button";
import TextInput from "../../../../../components/TextInput";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import SearchWithAdd from "../../../../../components/SearchWithAdd";
import { Ionicons } from "@expo/vector-icons";
import { updateReport } from "../../../../../storage/report";
import MaskedInput from "../../../../../components/MaskedInput";
import InfoBanner from "../../../../../components/InfoBanner";
import BottomSheetComponent from "../../../../../components/BottomSheet";

export default function DataEquipament({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipaments, setEquipaments] = useState([]);
  const [search, setSearch] = useState('');
  const [equipamentsFiltered, setEquipamentsFiltered] = useState([]);
  const [equipamentSelected, setEquipamentsSelected] = useState(null);
  const [equipamentCurrentHourMeter, setEquipamentsCurrentHourMeter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionItem, setActionItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const bottomSheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      start()
    }, [])
  )

  const start = async () => {
    setIsLoading(true);
    setError(null);

    const equipaments = await getAllEquipaments(orderService?.company?.id);

    setIsLoading(false);

    if (!equipaments.success) {
      setError(true);

      return;
    }

    setEquipaments(equipaments.data);
    setEquipamentsFiltered(equipaments.data);

    if (orderService) {
      const findEquipaments = equipaments.data.find(equipament => equipament.id === orderService?.equipament?.id);

      if (findEquipaments) {
        setEquipamentsSelected(findEquipaments);
      }

      setEquipamentsCurrentHourMeter(orderService.eq_current_hour_meter);
    }
  }

  const header = useMemo(() => {
    return (
      <View style={styles.headerContainer}>
        <View style={{ paddingHorizontal: 16 }}>
          <InfoBanner
            storageKey="@banner_select_hint"
            message="Dica: pesquise pelo nome do equipamento e toque para selecionar."
          />
        </View>

        <View style={{ height: 12 }} />

        <View style={{ paddingHorizontal: 16 }}>
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
            value={equipamentCurrentHourMeter}
            onChangeText={setEquipamentsCurrentHourMeter}
          />
        </View>

        <View style={styles.separator} />

        <View style={{ paddingHorizontal: 16 }}>
          <SearchWithAdd
            value={search}
            onChangeText={(text) => searchEquipaments(text)}
            onAdd={() => { handleAddEquipaments() }}
            isAddButton={true}
          />
          <Text style={{ marginTop: 8, fontSize: 12, color: '#6B7280' }}>
            {equipamentsFiltered.length} resultado{equipamentsFiltered.length === 1 ? '' : 's'}
          </Text>
        </View>
      </View>
    )
  }, [equipamentCurrentHourMeter, search, equipamentsFiltered.length]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleSaveEquipaments(item)}
        onLongPress={() => openActions(item)}
        style={styles.itemCard}
        activeOpacity={0.8}
      >
        <View style={styles.itemContent}>
          <Ionicons name="construct-outline" size={22} color="rgba(8, 36, 129, 0.98)" />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <Ionicons
          name={equipamentSelected?.id === item.id ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color="rgba(8, 36, 129, 0.98)"
        />
      </TouchableOpacity>
    )
  }

  const openActions = (item) => {
    setActionItem(item);
    bottomSheetRef.current?.expand?.();
  }

  const closeActions = () => {
    bottomSheetRef.current?.close?.();
    setActionItem(null);
    setIsDeleting(false);
  }

  const handleEditAction = () => {
    if (!actionItem) return;
    const params = { id, orderService, equipament: actionItem, mode: 'edit' };
    closeActions();
    navigation.navigate('AddEquipament', params);
  }

  const handleDeleteAction = () => {
    if (!actionItem) return;
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o equipamento "${actionItem?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: performDelete },
      ],
      { cancelable: true }
    );
  }

  const performDelete = async () => {
    if (!actionItem) return;
    try {
      setIsDeleting(true);
      const response = await deleteEquipament(orderService?.company?.id, actionItem.id);
      if (response?.success) {
        await start();
        closeActions();
      } else {
        setIsDeleting(false);
        Alert.alert('Erro', 'Não foi possível excluir o equipamento.');
      }
    } catch (e) {
      setIsDeleting(false);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir o equipamento.');
    }
  }

  const handleSaveEquipaments = async (item) => {
    try {
      if (!id) {
        return;
      }

      await updateOrderService(id, {
        equipament: item,
        eq_current_hour_meter: equipamentCurrentHourMeter,
      });

      await updateReport(id, {
        equipament_name: item?.name ?? '',
        sync: false,
      });

      navigation.goBack();
    } catch (error) {
      console.log('[x] - Erro ao salvar equipamentos', error);
    }
  }

  const handleAddEquipaments = () => {
    navigation.navigate('AddEquipament', { id: id, orderService: orderService });
  }

  const searchEquipaments = (search) => {
    setSearch(search);

    const filtered = equipaments.filter(equipament => equipament?.name?.toLowerCase().includes(search?.toLowerCase()));

    setEquipamentsFiltered(filtered || []);
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await start();
    } finally {
      setRefreshing(false);
    }
  }

  const EmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color="rgba(17, 17, 104, 0.98)" />
        <Text style={styles.emptyText}>Nenhum equipamento encontrado</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgba(8, 36, 129, 0.98)" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="rgba(8, 36, 129, 0.98)" />
          <Text style={styles.errorText}>Erro ao buscar equipamentos</Text>
          <Button title="Tentar novamente" onPress={start} />
        </View>
      )}

      {!isLoading && !error && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={equipamentsFiltered}
            renderItem={renderItem}
            ListHeaderComponent={header}
            ListEmptyComponent={EmptyComponent}
            keyExtractor={(item) => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
          <View style={styles.saveButtonContainer}>
            <Button title="Salvar" onPress={() => { handleSaveEquipaments(equipamentSelected) }} />
          </View>
        </View>
      )}

      <BottomSheetComponent bottomSheetRef={bottomSheetRef} title="Opções">
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEditAction}
            disabled={isDeleting}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="create-outline" size={22} color="rgba(8, 36, 129, 0.98)" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#111827' }}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDeleteAction}
            disabled={isDeleting}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
          >
            <Ionicons name="trash-outline" size={22} color="#DC2626" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#DC2626' }}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Text>
            {isDeleting && (
              <ActivityIndicator style={{ marginLeft: 8 }} size="small" color="#DC2626" />
            )}
          </TouchableOpacity>
        </View>
      </BottomSheetComponent>
    </KeyboardAvoidingView>
  )
}