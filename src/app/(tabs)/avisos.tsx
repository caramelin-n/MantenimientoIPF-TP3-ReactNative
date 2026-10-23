import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useReportes } from '@/lib/reportes';

export default function AvisosScreen() {
  const { avisos, marcarAvisoLeido } = useReportes();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Avisos</Text>
      {avisos.length === 0 ? (
        <Text style={styles.vacio}>Sin avisos.</Text>
      ) : (
        avisos.map((a) => (
          <Pressable
            key={a.id}
            style={[styles.card, !a.leido && styles.noLeido]}
            onPress={() => marcarAvisoLeido(a.id)}
          >
            <Text style={styles.mensaje}>{a.mensaje}</Text>
            <Text style={styles.fecha}>{new Date(a.fecha).toLocaleString()}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  vacio: { color: '#666', marginTop: 24, textAlign: 'center' },
  card: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 10, gap: 4 },
  noLeido: { borderLeftWidth: 4, borderLeftColor: '#208AEF' },
  mensaje: { fontSize: 14, color: '#333' },
  fecha: { fontSize: 11, color: '#888' },
});