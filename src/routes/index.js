
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Auth from '../pages/auth';
import BottomTabs from '../navigation';
import Splash from '../pages/splash';
import AddReportOrderService from '../pages/reports/orderService';
import DataEquipament from '../pages/reports/orderService/steps/dataEquipament';
import DataCompany from '../pages/reports/orderService/steps/dataCompany';
import AddEquipament from '../pages/reports/orderService/steps/dataEquipament/addEquipament';
import DataAttachments from '../pages/reports/orderService/steps/dataAttachments';
import TakePicture from '../pages/reports/orderService/steps/dataAttachments/TakePicture';
import DataGeneralServiceNotes from '../pages/reports/orderService/steps/dataGeneralServiceNotes';
import DataMaintenancePlans from '../pages/reports/orderService/steps/dataMaintenancePlans';
import DataRequiredReadings from '../pages/reports/orderService/steps/dataRequiredReadings';
import DataCompressedAirGenerationRoom from '../pages/reports/orderService/steps/dataCompressedAirGenerationRoom';
import DataClosureInformation from '../pages/reports/orderService/steps/dataClosureInformation';
import PreviewPDF from '../pages/reports/orderService/PreviewPDF';
import Signature from '../pages/reports/orderService/Signature';
import RegisterStepCode from '../pages/auth/register/StepCode';
import RegisterStepIdentity from '../pages/auth/register/StepIdentity';
import RegisterStepCredentials from '../pages/auth/register/StepCredentials';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Splash" 
          component={Splash} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RegisterStepCode" 
          component={RegisterStepCode} 
          options={{ title: 'Cadastro - Código' }}
        />
        <Stack.Screen 
          name="RegisterStepIdentity" 
          component={RegisterStepIdentity} 
          options={{ title: 'Cadastro - Identificação' }}
        />
        <Stack.Screen 
          name="RegisterStepCredentials" 
          component={RegisterStepCredentials} 
          options={{ title: 'Cadastro - Credenciais' }}
        />
        <Stack.Screen 
          name="Auth" 
          component={Auth} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={BottomTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ReportOrderService" 
          component={AddReportOrderService} 
          options={{ title: 'Ordem de Serviço' }}
        />
        <Stack.Screen 
          name="DataCompany" 
          component={DataCompany} 
          options={{ title: 'Dados da Empresa' }}
        />
        <Stack.Screen 
          name="DataEquipament" 
          component={DataEquipament} 
          options={{ title: 'Dados do Equipamento' }}
        />
        <Stack.Screen 
          name="AddEquipament" 
          component={AddEquipament} 
          options={{ title: 'Adicionar Equipamento' }}
        />
        <Stack.Screen 
          name="DataAttachments" 
          component={DataAttachments} 
          options={{ title: 'Anexos' }}
        />
        <Stack.Screen 
          name="TakePicture" 
          component={TakePicture} 
          options={{ title: 'Tirar foto' }}
        />
        <Stack.Screen 
          name="DataGeneralServiceNotes" 
          component={DataGeneralServiceNotes} 
          options={{ title: 'Considerações gerais de atendimento' }}
        />
        <Stack.Screen 
          name="DataMaintenancePlans" 
          component={DataMaintenancePlans} 
          options={{ title: 'Planos de manutenção' }}
        />
        <Stack.Screen 
          name="DataRequiredReadings" 
          component={DataRequiredReadings} 
          options={{ title: 'Leituras obrigatórias' }}
        />
        <Stack.Screen 
          name="DataCompressedAirGenerationRoom" 
          component={DataCompressedAirGenerationRoom} 
          options={{ title: 'Compressor de ar comprimido' }}
        />
        <Stack.Screen 
          name="DataClosureInformation" 
          component={DataClosureInformation} 
          options={{ title: 'Informações de encerramento' }}
        />
        <Stack.Screen 
          name="PreviewPDF" 
          component={PreviewPDF} 
          options={{ title: 'Visualizar PDF' }}
        />
        <Stack.Screen 
          name="Signature" 
          component={Signature} 
          options={{ title: 'Assinatura' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};