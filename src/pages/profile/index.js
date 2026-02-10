import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";
import styles from "./styles";
import { profileService } from "../../service/profile";
import { getReport } from "../../storage/report";

export default function Profile({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  const loadUnsynced = useCallback(async () => {
    try {
      const list = await getReport();
      const count = (list || []).filter((r) => !r?.sync).length;
      setUnsyncedCount(count);
    } catch {
      setUnsyncedCount(0);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileService.getProfile();
      if (!response.success) {
        setError(response.message || "Erro ao carregar perfil");
        setProfile(null);
      } else {
        setProfile(response.data);
      }
    } catch (e) {
      setError("Erro ao carregar perfil");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadUnsynced();
  }, [load, loadUnsynced]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([load(), loadUnsynced()]);
    } finally {
      setRefreshing(false);
    }
  };

  const confirmLogout = () => {
    const warn =
      unsyncedCount > 0
        ? `Você possui ${unsyncedCount} relatório(s) não sincronizado(s).\nAo sair, todos serão perdidos neste dispositivo.`
        : "Ao sair, você perderá relatórios não sincronizados que existam localmente.";
    Alert.alert(
      "Sair do aplicativo",
      `${warn}\n\nDeseja realmente sair?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: handleLogout,
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: "Splash" }],
      });
    }
  };

  const CompanyCard = useMemo(() => {
    const c = profile?.company || {};
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="business-outline" size={18} color="rgba(8, 36, 129, 0.98)" />
          <Text style={styles.cardHeaderTitle}>Empresa</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="pricetag-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>Nome</Text>
          <Text style={styles.rowValue}>{c?.name || "-"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="document-text-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>Documento</Text>
          <Text style={styles.rowValue}>{c?.document || "-"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="mail-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>E-mail</Text>
          <Text style={styles.rowValue}>{c?.email || "-"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="call-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>Telefone</Text>
          <Text style={styles.rowValue}>{c?.phone || "-"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="location-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>Endereço</Text>
          <Text style={styles.rowValue}>{c?.address || "-"}</Text>
        </View>
      </View>
    );
  }, [profile]);

  const UserCard = useMemo(() => {
    const u = profile?.user || {};
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-outline" size={18} color="rgba(8, 36, 129, 0.98)" />
          <Text style={styles.cardHeaderTitle}>Usuário</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="person-circle-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>Nome</Text>
          <Text style={styles.rowValue}>{u?.name || "-"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="mail-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>E-mail</Text>
          <Text style={styles.rowValue}>{u?.email || "-"}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowIcon}><Ionicons name="id-card-outline" size={16} color="#6B7280" /></View>
          <Text style={styles.rowLabel}>Documento</Text>
          <Text style={styles.rowValue}>{u?.document || "-"}</Text>
        </View>
      </View>
    );
  }, [profile]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#151D32" />
          <Text style={styles.subtitle}>Carregando perfil…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              <Ionicons name="person-circle-outline" size={64} color="#0c2168" />
            </View>
            <Text style={styles.title}>Perfil</Text>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {!!unsyncedCount && (
            <View style={styles.warnBox}>
              <Text style={styles.warnText}>
                Existem {unsyncedCount} relatório(s) não sincronizado(s) neste dispositivo.
              </Text>
            </View>
          )}

          {UserCard}
          {CompanyCard}

          <View style={{ height: 8 }} />
          <Button
            title="Sair do aplicativo"
            variant="danger"
            leftIcon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
            onPress={confirmLogout}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </View>
  );
}

