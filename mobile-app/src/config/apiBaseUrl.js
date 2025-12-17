import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'replyAssistant.apiBaseUrl';

function inferExpoDevHost() {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (typeof scriptURL !== 'string' || !scriptURL.trim()) return '';

  // Examples seen in RN/Expo:
  // - http://192.168.1.2:8081/index.bundle?...
  // - exp://192.168.1.2:8081
  // - 192.168.1.2:8081
  // - file://...
  const m = scriptURL.trim().match(/^(?:https?:\/\/|exp:\/\/)?([^/:?#]+)(?::\d+)?/i);
  const host = m?.[1] || '';
  if (!host) return '';
  if (host === 'file') return '';
  if (host === 'localhost' || host === '127.0.0.1') return '';
  return host;
}

function normalizeBaseUrl(raw) {
  if (typeof raw !== 'string') return '';
  let url = raw.trim();
  if (!url) return '';
  url = url.replace(/\/+$/g, '');

  // If user entered without scheme, assume http (dev-friendly).
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }

  try {
    // Validate basic URL shape.
    // eslint-disable-next-line no-new
    new URL(url);
    return url;
  } catch {
    return '';
  }
}

export function getDefaultApiBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  const envUrl = normalizeBaseUrl(fromEnv);
  if (envUrl) return envUrl;

  // In Expo dev on a physical device, infer the packager host and reuse it for the backend.
  // This avoids the common "10.0.2.2 only works on emulator" trap.
  const expoHost = inferExpoDevHost();
  if (expoHost) return `http://${expoHost}:3001`;

  // Local dev defaults:
  // - Android emulator reaches host machine as 10.0.2.2
  // - iOS simulator/web can use localhost
  if (Platform.OS === 'android') return 'http://10.0.2.2:3001';
  return 'http://localhost:3001';
}

export async function getApiBaseUrl() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const storedUrl = normalizeBaseUrl(stored);
    if (storedUrl) return storedUrl;
  } catch {
    // Ignore storage failures; fall back to default.
  }
  return getDefaultApiBaseUrl();
}

export async function setApiBaseUrlOverride(rawUrl) {
  const url = normalizeBaseUrl(rawUrl);
  if (!url) return { ok: false, error: 'Please enter a valid URL.' };
  await AsyncStorage.setItem(STORAGE_KEY, url);
  return { ok: true, value: url };
}

export async function clearApiBaseUrlOverride() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}


