
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../pages/auth';
import BottomTabs from '../navigation';
import Splash from '../pages/splash';
import AddReportOrderService from '../pages/reports/orderService';
import DataEquipament from '../pages/reports/orderService/steps/dataEquipament';
import DataCompany from '../pages/reports/orderService/steps/dataCompany';
import AddCompany from '../pages/reports/orderService/steps/dataCompany/addCompany';
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
import Reports from '../pages/reports';
import { headerStyle, headerTitleStyle } from '../navigation/styles';

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
          name="Reports" 
          component={Reports} 
          options={{ title: 'Relatórios', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="ReportOrderService" 
          component={AddReportOrderService} 
          options={{ title: 'Ordem de Serviço', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataCompany" 
          component={DataCompany} 
          options={{ title: 'Dados da Empresa', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="AddCompany" 
          component={AddCompany} 
          options={{ title: 'Adicionar Empresa', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataEquipament" 
          component={DataEquipament} 
          options={{ title: 'Dados do Equipamento', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="AddEquipament" 
          component={AddEquipament} 
          options={{ title: 'Adicionar Equipamento', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataAttachments" 
          component={DataAttachments} 
          options={{ title: 'Anexos', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="TakePicture" 
          component={TakePicture} 
          options={{ title: 'Tirar foto', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataGeneralServiceNotes" 
          component={DataGeneralServiceNotes} 
          options={{ title: 'Considerações gerais de atendimento', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataMaintenancePlans" 
          component={DataMaintenancePlans} 
          options={{ title: 'Planos de manutenção', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataRequiredReadings" 
          component={DataRequiredReadings} 
          options={{ title: 'Leituras obrigatórias', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataCompressedAirGenerationRoom" 
          component={DataCompressedAirGenerationRoom} 
          options={{ title: 'Compressor de ar comprimido', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="DataClosureInformation" 
          component={DataClosureInformation} 
          options={{ title: 'Informações de encerramento', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="PreviewPDF" 
          component={PreviewPDF} 
          options={{ title: 'Visualizar PDF', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
        <Stack.Screen 
          name="Signature" 
          component={Signature} 
          options={{ title: 'Assinatura', headerStyle: headerStyle, headerTitleStyle: headerTitleStyle, headerTintColor: '#fff'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};