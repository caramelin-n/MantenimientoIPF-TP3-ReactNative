import React, { createContext, useCallback, useContext, useState } from 'react';

export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';
export type Estado = 'pendiente' | 'en curso' | 'resuelto';
export type Sector = 'patio' | 'estacionamiento' | 'pasillo';
export type Ubicacion = { lat: number; lon: number; aproximada: boolean };

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  fecha: number;
  fotoUri?: string;
  ubicacion?: Ubicacion;
  sector?: Sector;
  estado: Estado;
};

export type Aviso = {
  id: string;
  mensaje: string;
  fecha: number;
  leido: boolean;
};

type ReportesContextValue = {
  reportes: Reporte[];
  avisos: Aviso[];
  crearReporte: (data: Omit<Reporte, 'id' | 'fecha' | 'estado'>) => string;
  actualizarEstado: (id: string, estado: Estado) => void;
  agregarAviso: (mensaje: string) => void;
  marcarAvisoLeido: (id: string) => void;
  obtenerPorId: (id: string) => Reporte | undefined;
};

const ReportesContext = createContext<ReportesContextValue | null>(null);

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ReportesProvider({ children }: { children: React.ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const crearReporte = useCallback((data: Omit<Reporte, 'id' | 'fecha' | 'estado'>) => {
    const id = uid();
    const nuevo: Reporte = {
      ...data,
      id,
      fecha: Date.now(),
      estado: 'pendiente',
    };
    setReportes((prev) => [nuevo, ...prev]);
    return id;
  }, []);

  const actualizarEstado = useCallback((id: string, estado: Estado) => {
    setReportes((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)));
  }, []);

  const agregarAviso = useCallback((mensaje: string) => {
    setAvisos((prev) => [{ id: uid(), mensaje, fecha: Date.now(), leido: false }, ...prev]);
  }, []);

  const marcarAvisoLeido = useCallback((id: string) => {
    setAvisos((prev) => prev.map((a) => (a.id === id ? { ...a, leido: true } : a)));
  }, []);

  const obtenerPorId = useCallback((id: string) => reportes.find((r) => r.id === id), [reportes]);

  return (
    <ReportesContext.Provider
      value={{
        reportes,
        avisos,
        crearReporte,
        actualizarEstado,
        agregarAviso,
        marcarAvisoLeido,
        obtenerPorId,
      }}
    >
      {children}
    </ReportesContext.Provider>
  );
}

export function useReportes() {
  const ctx = useContext(ReportesContext);
  if (!ctx) throw new Error('useReportes debe usarse dentro de ReportesProvider');
  return ctx;
}