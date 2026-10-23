export type Recurso = 'camera' | 'ubicacion' | 'notificaciones';

export const RECURSOS: Recurso[] = ['camera', 'ubicacion', 'notificaciones'];

export const BENEFICIO: Record<Recurso, string> = {
  camera: 'Usamos tu cámara para leer el QR del aula y fotografiar el desperfecto.',
  ubicacion: 'Usamos tu ubicación para marcar dónde está el problema.',
  notificaciones: 'Usamos tus notificaciones para avisarte cuando se resuelve tu reporte.',
};

export function nombreRecurso(r: Recurso): string {
  switch (r) {
    case 'camera':
      return 'Cámara';
    case 'ubicacion':
      return 'Ubicación';
    case 'notificaciones':
      return 'Notificaciones';
  }
}