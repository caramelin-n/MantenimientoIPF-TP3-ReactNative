import { Switch, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { usePermiso } from '@/hooks/usePermiso';

export default function AjustesScreen() {
  const permiso = usePermiso('notificaciones');
  const disponible = permiso.disponible;
  const [avisar, setAvisar] = useState(false);

  const onChange = async (value: boolean) => {
    if (!disponible) return;
    if (value) {
      if (permiso.estado === 'bloqueado') {
        permiso.abrirAjustes();
        return;
      }
      const r = await permiso.pedir();
      if (r.granted) setAvisar(true);
      else setAvisar(false);
    } else {
      setAvisar(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Ajustes</Text>
      <View style={styles.fila}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Avisarme cuando se resuelve mi reporte</Text>
          <Text style={styles.sub}>
            {disponible ? `Permiso: ${permiso.estado}` : 'Disponible solo en development build'}
          </Text>
        </View>
        <Switch value={avisar} onValueChange={(v) => void onChange(v)} disabled={!disponible} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  titulo: { fontSize: 22, fontWeight: '700' },
  fila: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 10, gap: 12 },
  label: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 12, color: '#666' },
});