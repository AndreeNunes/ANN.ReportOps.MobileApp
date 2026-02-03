import { Text, View } from "react-native";
import styles from "./style";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { authStorage } from "../../storage/auth";
import LottieViewComponent from "../../components/LottieViewComponent";

export default function Splash({ navigation }) {
  const [fontLoaded] = useFonts({
      'Inter-Regular': require('../../../assets/font/Inter/Inter_28pt-Regular.ttf'),
      'Inter-Light': require('../../../assets/font/Inter/Inter_28pt-Light.ttf'),
      'Inter-Bold': require('../../../assets/font/Inter/Inter_28pt-Bold.ttf'),
  })

  useEffect(() => {
    if (fontLoaded) {
      init();
    }
  }, [fontLoaded]);

  const init = async () => {
    const token = await authStorage.getToken();

    if (token) { 
      navigation.navigate('Main');
    } else {
      navigation.navigate('Auth');
    }
  }

  return (
    <View style={styles.container}>
      <LottieViewComponent source={require('../../../assets/animations/Loading.json')} />
    </View>
  );
}