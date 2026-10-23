import { useState } from 'react';
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { CameraView } from 'expo-camera';
import { usePermiso } from '@/hooks/usePermiso';

function EstadoCargando() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" />
      <Text>Cargando permiso de cámara…</Text>
    </View>
  );
}

function EstadoPreguntable({ continuar }: { continuar: () => void }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>Usamos tu cámara para leer el QR del aula.</Text>
      <View style={styles.botones}>
        <Pressable style={styles.boton} onPress={continuar}>
          <Text style={styles.botonTexto}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function EstadoBloqueado({ abrir }: { abrir: () => void }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.texto}>
        La cámara está bloqueada. Habilitala en Ajustes del sistema.
      </Text>
      <Pressable style={styles.boton} onPress={abrir}>
        <Text style={styles.botonTexto}>Abrir Ajustes</Text>
      </Pressable>
    </View>
  );
}

export default function EscanearScreen() {
  const permiso = usePermiso('camera');
  const [escaneado, setEscaneado] = useState(false);
  const [codigoManual, setCodigoManual] = useState('');

  const volverConCodigo = (codigo: string) => {
    if (!codigo.trim()) return;
    router.replace({ pathname: '/reporte/nuevo', params: { aula: codigo.trim() } });
  };

  if (permiso.estado === 'cargando') return <EstadoCargando />;
  if (permiso.estado === 'preguntable')
    return <EstadoPreguntable continuar={() => void permiso.pedir()} />;
  if (permiso.estado === 'bloqueado')
    return <EstadoBloqueado abrir={permiso.abrirAjustes} />;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camara}
        facing="back"
        onBarcodeScanned={
          escaneado
            ? undefined
            : (result) => {
                setEscaneado(true);
                volverConCodigo(result.data);
              }
        }
      />
      <View style={styles.manual}>
        <Text style={styles.manualLabel}>O escribí el código del aula a mano:</Text>
        <TextInput
          style={styles.input}
          value={codigoManual}
          onChangeText={setCodigoManual}
          placeholder="Código del aula"
        />
        <Button title="Usar código" onPress={() => volverConCodigo(codigoManual)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  texto: { textAlign: 'center', fontSize: 15 },
  botones: { marginTop: 8 },
  boton: { backgroundColor: '#208AEF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  botonTexto: { color: 'white', fontWeight: '600' },
  camara: { flex: 3 },
  manual: { flex: 1, padding: 16, gap: 8, backgroundColor: 'white' },
  manualLabel: { fontSize: 13, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});