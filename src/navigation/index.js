import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Reports from '../pages/reports';
import Dashboard from '../pages/dashboard';
import { headerStyle, headerTitleStyle, tabBarLabelStyle, tabBarStyle } from './styles';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const getIconName = (routeName, focused) => {
    switch (routeName) {
      case 'Reports':
        return focused ? 'document-text' : 'document-text-outline';
      case 'Dashboard':
        return focused ? 'stats-chart' : 'stats-chart-outline';
      case 'Profile':
        return focused ? 'person-circle' : 'person-circle-outline';
      default:
        return focused ? 'ellipse' : 'ellipse-outline';
    }
  };

  const tabBarIcon = ({ focused, color, size }, route) => {
    const iconName = getIconName(route.name, focused);

    return <Ionicons name={iconName} size={size} color={color} />;
  }
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => tabBarIcon({ focused, color, size }, route),
        tabBarActiveTintColor: 'rgba(255,255,255,1)',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
        tabBarStyle: tabBarStyle,
        tabBarLabelStyle: tabBarLabelStyle,
        headerStyle: headerStyle,
        headerTitleStyle: headerTitleStyle,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="Reports" 
        options={{ title: 'Relatórios' }}
        component={Reports}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Dashboard}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};
