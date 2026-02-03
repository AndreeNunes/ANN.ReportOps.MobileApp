import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";
import styles from "./styles";

export default function Dashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles-outline" size={48} color="#0c2168" />
        </View>
        <Text style={styles.title}>Em breve</Text>
        <Text style={styles.subtitle}>
          Estamos preparando novidades para você.
        </Text>
        <Button
          title="Ir para Relatórios"
          onPress={() => navigation.navigate('Reports')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}