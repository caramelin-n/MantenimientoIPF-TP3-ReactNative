import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: 'Reportes', tabBarLabel: 'Reportes' }} />
      <Tabs.Screen name="avisos" options={{ title: 'Avisos', tabBarLabel: 'Avisos' }} />
      <Tabs.Screen name="permisos" options={{ title: 'Permisos', tabBarLabel: 'Permisos' }} />
    </Tabs>
  );
}