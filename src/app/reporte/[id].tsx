/* eslint-disable @typescript-eslint/no-require-imports */
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useReportes } from '@/lib/reportes';

const NOTIFICATIONS_MODULE = (() => {
  try {
    return require('expo-notifications');
  } catch {
    return null;
  }
})();

export default function DetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reportes, actualizarEstado, agregarAviso } = useReportes();
  const reporte = reportes.find((r) => r.id === id);

  if (!reporte) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Reporte no encontrado</Text>
        <Pressable style={styles.boton} onPress={() => router.replace('/')}>
          <Text style={styles.botonTexto}>Volver a reportes</Text>
        </Pressable>
      </View>
    );
  }

  const simularResolucion = async () => {
    actualizarEstado(reporte.id, 'resuelto');
    agregarAviso(`Se resolvió tu reporte: ${reporte.titulo}`);
    try {
      if (!NOTIFICATIONS_MODULE) return;
      const perm = await NOTIFICATIONS_MODULE.getPermissionsAsync();
      if (perm.granted) {
        if (Platform.OS === 'android') {
          await NOTIFICATIONS_MODULE.setNotificationChannelAsync('reportes', {
            name: 'Reportes',
            importance: NOTIFICATIONS_MODULE.AndroidImportance.HIGH,
          });
        }
        await NOTIFICATIONS_MODULE.scheduleNotificationAsync({
          content: { title: 'Reporte resuelto', body: reporte.titulo },
          trigger: {
            type: NOTIFICATIONS_MODULE.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 10,
            channelId: 'reportes',
          },
        });
      }
    } catch {
      /* noop */
    }
    Alert.alert('Resolución simulada', 'El reporte se marcó como resuelto.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{reporte.titulo}</Text>
      <Text style={styles.sub}>{reporte.estado.toUpperCase()}</Text>

      <View style={styles.bloque}>
        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.valor}>{reporte.descripcion || 'Sin descripción'}</Text>
      </View>
      <View style={styles.bloque}>
        <Text style={styles.label}>Aula</Text>
        <Text style={styles.valor}>{reporte.aula}</Text>
      </View>
      <View style={styles.bloque}>
        <Text style={styles.label}>Categoría</Text>
        <Text style={styles.valor}>{reporte.categoria}</Text>
      </View>
      <View style={styles.bloque}>
        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.valor}>{new Date(reporte.fecha).toLocaleString()}</Text>
      </View>

      {reporte.fotoUri ? (
        <View style={styles.bloque}>
          <Text style={styles.label}>Foto</Text>
          <Image source={{ uri: reporte.fotoUri }} style={styles.foto} contentFit="cover" />
        </View>
      ) : null}

      <View style={styles.bloque}>
        <Text style={styles.label}>Ubicación / sector</Text>
        {reporte.ubicacion ? (
          <Text style={styles.valor}>
            {reporte.ubicacion.aproximada
              ? 'Ubicación aproximada'
              : `${reporte.ubicacion.lat.toFixed(5)}, ${reporte.ubicacion.lon.toFixed(5)}`}
          </Text>
        ) : reporte.sector ? (
          <Text style={styles.valor}>{reporte.sector}</Text>
        ) : (
          <Text style={styles.valor}>Sin ubicación</Text>
        )}
      </View>

      <Pressable style={styles.boton} onPress={() => void simularResolucion()}>
        <Text style={styles.botonTexto}>Simular resolución</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  titulo: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 12, color: '#888', fontWeight: '600' },
  bloque: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 10, gap: 4 },
  label: { fontSize: 12, color: '#888', fontWeight: '600' },
  valor: { fontSize: 15, color: '#333' },
  foto: { width: '100%', height: 220, borderRadius: 10, marginTop: 6 },
  boton: { backgroundColor: '#1f9d55', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  botonTexto: { color: 'white', fontWeight: '600' },
});