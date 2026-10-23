/* eslint-disable @typescript-eslint/no-require-imports */
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import { Recurso } from '@/lib/permisos';
import { useRevisarAlVolver } from './useRevisarAlVolver';

const NOTIFICATIONS_MODULE = (() => {
  try {
    return require('expo-notifications');
  } catch {
    return null;
  }
})();

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type Parcial =
  | { tipo: 'ninguno' }
  | { tipo: 'aproximada' }
  | { tipo: 'limitado' }
  | { tipo: 'provisional' };

export function usePermiso(recurso: Recurso) {
  const [camPerm, requestCam, getCamPerm] = Camera.useCameraPermissions();
  const [locPerm, requestLoc, getLocPerm] = Location.useForegroundPermissions();
  const [notifPerm, setNotifPerm] = useState<any>(
    NOTIFICATIONS_MODULE ? null : { granted: false, canAskAgain: false, status: 'denied' },
  );

  const cargarNotif = useCallback(async () => {
    if (!NOTIFICATIONS_MODULE) {
      setNotifPerm({ granted: false, canAskAgain: false, status: 'denied' });
      return;
    }
    const p = await NOTIFICATIONS_MODULE.getPermissionsAsync();
    setNotifPerm(p);
  }, []);

  useEffect(() => {
    if (recurso !== 'notificaciones') return;
    let cancelado = false;
    void (async () => {
      if (!NOTIFICATIONS_MODULE) return;
      const p = await NOTIFICATIONS_MODULE.getPermissionsAsync();
      if (!cancelado) setNotifPerm(p);
    })();
    return () => {
      cancelado = true;
    };
  }, [recurso]);

  const refrescar = useCallback(async () => {
    if (recurso === 'camera') await getCamPerm();
    else if (recurso === 'ubicacion') await getLocPerm();
    else await cargarNotif();
  }, [recurso, getCamPerm, getLocPerm, cargarNotif]);

  useRevisarAlVolver(() => {
    void refrescar();
  });

  let estado: EstadoPermiso = 'cargando';
  let parcial: Parcial = { tipo: 'ninguno' };

  if (recurso === 'camera') {
    const p = camPerm as any;
    if (!p) estado = 'cargando';
    else if (p.granted) estado = 'concedido';
    else if (p.canAskAgain) estado = 'preguntable';
    else estado = 'bloqueado';
  } else if (recurso === 'ubicacion') {
    const p = locPerm as any;
    if (!p) estado = 'cargando';
    else if (p.granted) {
      estado = 'concedido';
      const approx =
        (p.android && p.android.accuracy === 'coarse') ||
        (p.ios && p.ios.accuracy === 'reduced');
      if (approx) parcial = { tipo: 'aproximada' };
    } else if (p.canAskAgain) estado = 'preguntable';
    else estado = 'bloqueado';
  } else {
    const p = notifPerm;
    if (!p) estado = 'cargando';
    else if (p.granted) estado = 'concedido';
    else if (p.canAskAgain) estado = 'preguntable';
    else estado = 'bloqueado';
  }

  const pedir = useCallback(async () => {
    if (recurso === 'camera') {
      const r = await requestCam();
      await getCamPerm();
      return r;
    }
    if (recurso === 'ubicacion') {
      const r = await requestLoc();
      await getLocPerm();
      return r;
    }
    if (!NOTIFICATIONS_MODULE) {
      return { granted: false, canAskAgain: false, status: 'denied' } as any;
    }
    if (Platform.OS === 'android') {
      await NOTIFICATIONS_MODULE.setNotificationChannelAsync('reportes', {
        name: 'Reportes',
        importance: NOTIFICATIONS_MODULE.AndroidImportance.HIGH,
      });
    }
    const r = await NOTIFICATIONS_MODULE.requestPermissionsAsync();
    setNotifPerm(r);
    return r;
  }, [recurso, requestCam, getCamPerm, requestLoc, getLocPerm]);

  const abrirAjustes = useCallback(() => {
    void Linking.openSettings();
  }, []);

  return { estado, parcial, pedir, abrirAjustes, refrescar, disponible: !!NOTIFICATIONS_MODULE };
}