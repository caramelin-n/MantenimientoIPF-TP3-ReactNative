import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Recurso, nombreRecurso } from '@/lib/permisos';
import { usePermiso } from '@/hooks/usePermiso';

const RECURSOS: Recurso[] = ['camera', 'ubicacion', 'notificaciones'];

function Fila({ recurso }: { recurso: Recurso }) {
  const { estado, parcial, pedir, abrirAjustes } = usePermiso(recurso);
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{nombreRecurso(recurso)}</Text>
        <Text style={styles.estado}>
          {estado}
          {parcial.tipo !== 'ninguno' ? ` (${parcial.tipo})` : ''}
        </Text>
        <Text style={styles.plat}>Plataforma: {Platform.OS}</Text>
      </View>
      <View style={styles.acciones}>
        <Link href={`/permisos/${recurso}`} asChild>
          <Pressable style={styles.botonSec}>
            <Text style={styles.botonSecTexto}>Ver</Text>
          </Pressable>
        </Link>
        {estado === 'preguntable' ? (
          <Pressable style={styles.boton} onPress={() => void pedir()}>
            <Text style={styles.botonTexto}>Pedir</Text>
          </Pressable>
        ) : estado === 'bloqueado' ? (
          <Pressable style={styles.boton} onPress={abrirAjustes}>
            <Text style={styles.botonTexto}>Ajustes</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function PermisosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Permisos</Text>
      {RECURSOS.map((r) => (
        <Fila key={r} recurso={r} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  row: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
  },
  nombre: { fontSize: 16, fontWeight: '600' },
  estado: { color: '#555', fontSize: 13, textTransform: 'capitalize' },
  plat: { color: '#888', fontSize: 11 },
  acciones: { justifyContent: 'center', gap: 6 },
  boton: { backgroundColor: '#208AEF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  botonTexto: { color: 'white', fontSize: 12, fontWeight: '600' },
  botonSec: { backgroundColor: '#ddd', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  botonSecTexto: { color: '#333', fontSize: 12, fontWeight: '600' },
});