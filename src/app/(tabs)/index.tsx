import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Estado, useReportes } from '@/lib/reportes';

function colorEstado(e: Estado) {
  if (e === 'resuelto') return '#1f9d55';
  if (e === 'en curso') return '#c08000';
  return '#c0392b';
}

export default function HomeScreen() {
  const { reportes } = useReportes();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
        <Pressable style={styles.boton} onPress={() => router.push('/reporte/nuevo')}>
          <Text style={styles.botonTexto}>Nuevo reporte</Text>
        </Pressable>
      </View>

      {reportes.length === 0 ? (
        <Text style={styles.vacio}>No hay reportes todavía.</Text>
      ) : (
        reportes.map((r) => (
          <Link key={r.id} href={`/reporte/${r.id}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>{r.titulo}</Text>
                <Text style={[styles.estado, { color: colorEstado(r.estado) }]}>{r.estado}</Text>
              </View>
              <Text style={styles.cardSub}>{r.aula} · {r.categoria}</Text>
              <Text numberOfLines={2} style={styles.cardDesc}>{r.descripcion}</Text>
            </Pressable>
          </Link>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  boton: { backgroundColor: '#208AEF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  botonTexto: { color: 'white', fontWeight: '600' },
  vacio: { color: '#666', marginTop: 24, textAlign: 'center' },
  card: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 10, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitulo: { fontSize: 16, fontWeight: '600', flex: 1 },
  estado: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  cardSub: { color: '#666', fontSize: 13 },
  cardDesc: { color: '#333', fontSize: 13 },
});