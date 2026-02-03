import 'react-native-gesture-handler';
import 'react-native-reanimated';

import Routes from './src/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/toast/toastConfig';
import { StatusBar } from 'expo-status-bar';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'grey' }}>
      <StatusBar style="light" />
      <BottomSheetModalProvider>
        <Routes />
      </BottomSheetModalProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );

}

