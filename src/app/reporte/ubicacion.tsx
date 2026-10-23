import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { usePermiso } from '@/hooks/usePermiso';
import { Sector } from '@/lib/reportes';

const SECTORES: Sector[] = ['patio', 'estacionamiento', 'pasillo'];

export default function UbicacionScreen() {
  const permiso = usePermiso('ubicacion');
  const [pos, setPos] = useState<{ lat: number; lon: number; aproximada: boolean } | null>(null);
  const [cargando, setCargando] = useState(false);

  const marcar = async () => {
    if (permiso.estado === 'preguntable') {
      const r = await permiso.pedir();
      if (!r.granted) return;
    }
    if (permiso.estado === 'bloqueado') {
      permiso.abrirAjustes();
      return;
    }
    setCargando(true);
    try {
      const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const aproximada = permiso.parcial.tipo === 'aproximada';
      setPos({ lat: cur.coords.latitude, lon: cur.coords.longitude, aproximada });
    } catch {
      /* noop */
    } finally {
      setCargando(false);
    }
  };

  const usarPos = () => {
    if (!pos) return;
    router.replace({
      pathname: '/reporte/nuevo',
      params: { lat: pos.lat, lon: pos.lon, aproximada: pos.aproximada ? '1' : '0' },
    });
  };

  const usarSector = (sector: Sector) => {
    router.replace({ pathname: '/reporte/nuevo', params: { sector } });
  };

  if (permiso.estado === 'cargando') {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (permiso.estado === 'preguntable') {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>Usamos tu ubicación para marcar dónde está el problema.</Text>
        <Pressable style={styles.boton} onPress={() => void permiso.pedir()}>
          <Text style={styles.botonTexto}>Continuar</Text>
        </Pressable>
      </View>
    );
  }

  if (permiso.estado === 'bloqueado') {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>Ubicación bloqueada. Elegí el sector a mano.</Text>
        <View style={styles.sectores}>
          {SECTORES.map((s) => (
            <Pressable key={s} style={styles.botonSec} onPress={() => usarSector(s)}>
              <Text style={styles.botonSecTexto}>{s}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.boton} onPress={permiso.abrirAjustes}>
          <Text style={styles.botonTexto}>Abrir Ajustes</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Marcar ubicación</Text>
      {cargando ? <ActivityIndicator /> : null}
      {!pos ? (
        <Pressable style={styles.boton} onPress={() => void marcar()}>
          <Text style={styles.botonTexto}>Marcar ubicación actual</Text>
        </Pressable>
      ) : (
        <>
          <Text style={styles.dato}>
            {pos.aproximada ? 'Ubicación aproximada' : `${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}`}
          </Text>
          <Pressable style={styles.boton} onPress={usarPos}>
            <Text style={styles.botonTexto}>Usar esta ubicación</Text>
          </Pressable>
        </>
      )}
      <Text style={styles.sub}>O elegí el sector a mano:</Text>
      <View style={styles.sectores}>
        {SECTORES.map((s) => (
          <Pressable key={s} style={styles.botonSec} onPress={() => usarSector(s)}>
            <Text style={styles.botonSecTexto}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  titulo: { fontSize: 22, fontWeight: '700' },
  texto: { textAlign: 'center', fontSize: 15 },
  dato: { fontSize: 16, fontWeight: '600', color: '#333' },
  sub: { marginTop: 8, color: '#666' },
  sectores: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  boton: { backgroundColor: '#208AEF', padding: 14, borderRadius: 10, alignItems: 'center' },
  botonTexto: { color: 'white', fontWeight: '600' },
  botonSec: { backgroundColor: '#ddd', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  botonSecTexto: { color: '#333', fontWeight: '600', textTransform: 'capitalize' },
});