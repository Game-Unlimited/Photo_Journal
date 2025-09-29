import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';

import { PhotoEntry } from '../types';
import { base64ToBlob } from '../utils/base64';

const PREF_KEY = 'photo-journal:entries';

async function readEntriesFromPreferences(): Promise<PhotoEntry[]> {
  const { value } = await Preferences.get({ key: PREF_KEY });
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as PhotoEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEntriesToPreferences(entries: PhotoEntry[]): Promise<void> {
  await Preferences.set({ key: PREF_KEY, value: JSON.stringify(entries) });
}

function generateId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadEntries(): Promise<PhotoEntry[]> {
  const entries = await readEntriesFromPreferences();
  return entries.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function takeAndSavePhoto(): Promise<PhotoEntry> {
  const photo = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
    allowEditing: false,
    saveToGallery: false,
  });

  const base64 = photo.base64String ?? '';
  const mime = photo.format ? `image/${photo.format}` : 'image/jpeg';
  const blob = await base64ToBlob(base64, mime);

  const id = generateId();
  const fileName = `${id}.${photo.format ?? 'jpg'}`;

  const fileWrite = await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Data,
    recursive: true,
  });

  // Attempt to build a webPath for web preview if available
  let webPath: string | null = null;
  try {
    // On native, convert fileUri to a web path through Filesystem.getUri is not needed.
    // On web, we can create object URL from blob for immediate preview.
    webPath = URL.createObjectURL(blob);
  } catch {
    webPath = null;
  }

  const entry: PhotoEntry = {
    id,
    title: '',
    fileName,
    fileUri: fileWrite.uri,
    webPath,
    createdAt: new Date().toISOString(),
  };
  return entry;
}

export async function saveEntry(entry: PhotoEntry): Promise<PhotoEntry> {
  const entries = await readEntriesFromPreferences();
  const exists = entries.some((e) => e.id === entry.id);
  const newEntries = exists ? entries.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...entries];
  await writeEntriesToPreferences(newEntries);
  return entry;
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await readEntriesFromPreferences();
  const target = entries.find((e) => e.id === id);
  if (target) {
    await Filesystem.deleteFile({ path: target.fileName, directory: Directory.Data }).catch(() => {});
  }
  const filtered = entries.filter((e) => e.id !== id);
  await writeEntriesToPreferences(filtered);
}

export async function updateTitle(id: string, newTitle: string): Promise<void> {
  const entries = await readEntriesFromPreferences();
  const updated = entries.map((e) => (e.id === id ? { ...e, title: newTitle } : e));
  await writeEntriesToPreferences(updated);
}

export async function shareEntry(id: string): Promise<void> {
  const entries = await readEntriesFromPreferences();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  await Share.share({
    title: entry.title || 'Photo',
    text: entry.title,
    url: entry.fileUri,
    dialogTitle: 'Chia sẻ ảnh',
  });
}


