import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Recurso, BENEFICIO, nombreRecurso } from '@/lib/permisos';
import { usePermiso } from '@/hooks/usePermiso';

function esRecurso(v: string): v is Recurso {
  return v === 'camera' || v === 'ubicacion' || v === 'notificaciones';
}

export default function PreviewPermiso() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const router = useRouter();
  const recursoSafe = typeof recurso === 'string' && esRecurso(recurso) ? recurso : 'camera';
  const permiso = usePermiso(recursoSafe);
  const bloqueado = permiso.estado === 'bloqueado';

  const onContinuar = async () => {
    if (bloqueado) {
      permiso.abrirAjustes();
      return;
    }
    await permiso.pedir();
    if (permiso.estado !== 'bloqueado') router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{nombreRecurso(recursoSafe)}</Text>
      <Text style={styles.beneficio}>{BENEFICIO[recursoSafe]}</Text>
      <Text style={styles.aclaracion}>
        Puedes cambiar esta decision en Ajustes del sistema.
      </Text>

      {bloqueado ? (
        <View style={styles.bloqueadoBox}>
          <Text style={styles.bloqueadoTexto}>
            El permiso esta bloqueado. Habilitalo desde Ajustes {'>'} Aplicaciones {'>'} MantenimientoIPF.
          </Text>
        </View>
      ) : null}

      <Pressable style={styles.boton} onPress={() => void onContinuar()}>
        <Text style={styles.botonTexto}>{bloqueado ? 'Abrir Ajustes' : 'Continuar'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, alignItems: 'stretch' },
  titulo: { fontSize: 22, fontWeight: '700' },
  beneficio: { fontSize: 16, color: '#333' },
  aclaracion: { fontSize: 12, color: '#888' },
  bloqueadoBox: { backgroundColor: '#fde2e2', padding: 12, borderRadius: 8 },
  bloqueadoTexto: { color: '#a61b1b', fontSize: 13 },
  boton: { backgroundColor: '#208AEF', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  botonTexto: { color: 'white', fontWeight: '600', fontSize: 16 },
});