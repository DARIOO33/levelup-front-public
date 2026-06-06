'use client';
import { useEffect } from 'react';
import { useSettingsStore } from '@/store';

export default function SettingsInit() {
  const init = useSettingsStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return null;
}
