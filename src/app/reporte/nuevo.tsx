import { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useReportes, Categoria } from '@/lib/reportes';
import { Image } from 'expo-image';

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'electricidad', label: 'Electricidad' },
  { value: 'agua', label: 'Agua' },
  { value: 'mobiliario', label: 'Mobiliario' },
  { value: 'equipos', label: 'Equipos' },
];

function toArray<T>(v: T | T[] | undefined): T | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default function NuevoReporte() {
  const params = useLocalSearchParams<{
    aula?: string | string[];
    foto?: string | string[];
    lat?: string | string[];
    lon?: string | string[];
    aproximada?: string | string[];
    sector?: string | string[];
  }>();
  const { crearReporte, borrador, limpiarBorrador } = useReportes();

  const paramAula = toArray(params.aula);
  const paramLat = toArray(params.lat);
  const paramLon = toArray(params.lon);
  const paramAprox = toArray(params.aproximada);
  const paramSector = toArray(params.sector);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState(borrador.aula ?? (paramAula ? String(paramAula) : ''));
  const [categoria, setCategoria] = useState<Categoria>('electricidad');
  const [fotoUri, setFotoUri] = useState<string | undefined>(borrador.fotoUri);
  const [ubicacion, setUbicacion] = useState<{ lat: number; lon: number; aproximada: boolean } | undefined>(
    borrador.ubicacion ??
      (paramLat && paramLon
        ? { lat: Number(paramLat), lon: Number(paramLon), aproximada: paramAprox === '1' }
        : undefined),
  );
  const [sector, setSector] = useState<string | undefined>(borrador.sector ?? (paramSector ? String(paramSector) : undefined));

  useFocusEffect(
    useCallback(() => {
      if (borrador.aula !== undefined) setAula(borrador.aula);
      if (borrador.fotoUri !== undefined) setFotoUri(borrador.fotoUri);
      if (borrador.ubicacion !== undefined) setUbicacion(borrador.ubicacion);
      if (borrador.sector !== undefined) setSector(borrador.sector);
    }, [borrador.aula, borrador.fotoUri, borrador.ubicacion, borrador.sector]),
  );

  const guardar = () => {
    if (!titulo.trim()) {
      Alert.alert('Falta el título', 'Ingresá un título para el reporte.');
      return;
    }
    const id = crearReporte({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      aula: aula.trim() || 'Sin especificar',
      categoria,
      fotoUri,
      ubicacion,
      sector: sector as any,
    });
    limpiarBorrador();
    router.replace(`/reporte/${id}`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ej. Luz quemada" />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe el problema"
          multiline
        />

        <Text style={styles.label}>Aula</Text>
        <TextInput style={styles.input} value={aula} onChangeText={setAula} placeholder="Ej. Aula 3" />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.chips}>
          {CATEGORIAS.map((c) => (
            <Pressable
              key={c.value}
              style={[styles.chip, categoria === c.value && styles.chipActivo]}
              onPress={() => setCategoria(c.value)}
            >
              <Text style={[styles.chipTexto, categoria === c.value && styles.chipTextoActivo]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.acciones}>
          <Pressable style={styles.botonSec} onPress={() => router.push('/reporte/escanear')}>
            <Text style={styles.botonSecTexto}>Escanear QR</Text>
          </Pressable>
          <Pressable style={styles.botonSec} onPress={() => router.push('/reporte/foto')}>
            <Text style={styles.botonSecTexto}>Adjuntar foto</Text>
          </Pressable>
          <Pressable style={styles.botonSec} onPress={() => router.push('/reporte/ubicacion')}>
            <Text style={styles.botonSecTexto}>Marcar ubicación</Text>
          </Pressable>
        </View>

        {fotoUri ? (
          <View style={styles.fotoBloque}>
            <Image source={{ uri: fotoUri }} style={styles.fotoMini} contentFit="cover" />
            <Text style={styles.info}>Foto adjunta</Text>
          </View>
        ) : null}
        {ubicacion ? (
          <Text style={styles.info}>
            Ubicación: {ubicacion.aproximada ? 'Ubicación aproximada' : `${ubicacion.lat.toFixed(5)}, ${ubicacion.lon.toFixed(5)}`}
          </Text>
        ) : null}
        {sector ? <Text style={styles.info}>Sector: {sector}</Text> : null}

        <Pressable style={styles.boton} onPress={guardar}>
          <Text style={styles.botonTexto}>Guardar reporte</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  label: { fontWeight: '600', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: 'white' },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#e5e5e5' },
  chipActivo: { backgroundColor: '#208AEF' },
  chipTexto: { color: '#333' },
  chipTextoActivo: { color: 'white', fontWeight: '600' },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  boton: { backgroundColor: '#208AEF', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  botonTexto: { color: 'white', fontWeight: '600' },
  botonSec: { backgroundColor: '#ddd', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  botonSecTexto: { color: '#333', fontWeight: '600' },
  info: { color: '#555', fontSize: 13 },
  fotoBloque: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fotoMini: { width: 64, height: 64, borderRadius: 8 },
});