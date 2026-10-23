import { useState } from 'react';
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { usePermiso } from '@/hooks/usePermiso';

export default function FotoScreen() {
  const permiso = usePermiso('camera');
  const [uri, setUri] = useState<string | null>(null);

  const sacarFoto = async () => {
    if (permiso.estado === 'preguntable') {
      const r = await permiso.pedir();
      if (!r.granted) return;
    }
    if (permiso.estado === 'bloqueado') {
      permiso.abrirAjustes();
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setUri(result.assets[0].uri);
    }
  };

  const elegirGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setUri(result.assets[0].uri);
    }
  };

  const confirmar = () => {
    if (uri) router.replace({ pathname: '/reporte/nuevo', params: { foto: uri } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Adjuntar foto</Text>
      <View style={styles.acciones}>
        <Pressable
          style={styles.boton}
          onPress={() => void sacarFoto()}
        >
          <Text style={styles.botonTexto}>
            {permiso.estado === 'bloqueado' ? 'Cámara bloqueada' : 'Sacar foto'}
          </Text>
        </Pressable>
        <Pressable style={styles.botonSec} onPress={() => void elegirGaleria()}>
          <Text style={styles.botonSecTexto}>Elegir de la galería</Text>
        </Pressable>
      </View>

      {uri ? (
        <>
          <Image source={{ uri }} style={styles.preview} />
          <Button title="Usar esta foto" onPress={confirmar} />
        </>
      ) : (
        <Text style={styles.info}>
          La galería usa el selector del sistema, sin permiso de la app.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  titulo: { fontSize: 22, fontWeight: '700' },
  acciones: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  boton: { backgroundColor: '#208AEF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  botonTexto: { color: 'white', fontWeight: '600' },
  botonSec: { backgroundColor: '#ddd', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  botonSecTexto: { color: '#333', fontWeight: '600' },
  preview: { width: '100%', height: 260, borderRadius: 10 },
  info: { color: '#666', marginTop: 12 },
});