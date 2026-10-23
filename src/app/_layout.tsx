import { Stack } from 'expo-router';
import { ReportesProvider } from '@/lib/reportes';

export default function RootLayout() {
  return (
    <ReportesProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/nuevo" options={{ title: 'Nuevo reporte' }} />
        <Stack.Screen name="reporte/escanear" options={{ title: 'Escanear QR' }} />
        <Stack.Screen name="reporte/foto" options={{ title: 'Adjuntar foto' }} />
        <Stack.Screen name="reporte/ubicacion" options={{ title: 'Ubicación' }} />
        <Stack.Screen name="reporte/[id]" options={{ title: 'Detalle del reporte' }} />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{ presentation: 'modal', title: 'Permiso' }}
        />
        <Stack.Screen name="ajustes-app" options={{ title: 'Ajustes' }} />
      </Stack>
    </ReportesProvider>
  );
}