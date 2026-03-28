import { createLogger } from '@/utils/logger';

const endpoint = import.meta.env.VITE_IMAGEKIT_ENDPOINT || 'https://ik.imagekit.io/0aimsgqkt/';
const uploadEndpoint = import.meta.env.VITE_IMAGEKIT_UPLOAD_URL || 'https://upload.imagekit.io/api/v1/files/upload';
const rawAuthEndpoint = import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT || '/api/imagekit-auth';
const authEndpoint =
  /^https?:\/\/localhost:5000\/api\/imagekit-auth\/?$/i.test(rawAuthEndpoint)
    ? '/api/imagekit-auth'
    : rawAuthEndpoint;
const publicKeyFromEnv = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

const log = createLogger('imagekitService');

const normalize = (path = '') => path.replace(/^\/+/, '');

const toTransformString = (transformations = {}) => {
  const pairs = [];
  if (transformations.w) pairs.push(`w-${transformations.w}`);
  if (transformations.h) pairs.push(`h-${transformations.h}`);
  if (transformations.q) pairs.push(`q-${transformations.q}`);
  if (transformations.f) pairs.push(`f-${transformations.f}`);
  return pairs.length ? `tr:${pairs.join(',')}/` : '';
};

export const getImageUrl = (path, transformations) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const transformPrefix = toTransformString(transformations);
  return `${endpoint}${transformPrefix}${normalize(path)}`;
};

export const getThumbnailUrl = (path, width = 480, height = 320) =>
  getImageUrl(path, { w: width, h: height, q: 80, f: 'auto' });

export const getDocumentUrl = (path) => getImageUrl(path);

const getUploadAuth = async () => {
  if (!authEndpoint) {
    log.error('ImageKit auth endpoint missing');
    throw new Error('Missing VITE_IMAGEKIT_AUTH_ENDPOINT configuration.');
  }

  const response = await fetch(authEndpoint);
  if (!response.ok) {
    log.error('ImageKit auth request failed', { status: response.status, endpoint: authEndpoint });
    throw new Error('Failed to fetch ImageKit upload auth parameters.');
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    const text = await response.text().catch(() => '');
    log.error('ImageKit auth response is not JSON', {
      endpoint: authEndpoint,
      preview: text.slice(0, 120)
    });
    throw new Error(
      'ImageKit auth endpoint returned non-JSON response. Check /api/imagekit-auth routing and auth service.'
    );
  }
  const token = data.token || data.authenticationParameters?.token;
  const expire = data.expire || data.authenticationParameters?.expire;
  const signature = data.signature || data.authenticationParameters?.signature;
  const publicKey = data.publicKey || data.authenticationParameters?.publicKey || publicKeyFromEnv;

  if (!token || !expire || !signature || !publicKey) {
    log.error('ImageKit auth response invalid', { endpoint: authEndpoint });
    throw new Error('Invalid ImageKit auth response. Required fields: token, expire, signature, publicKey.');
  }

  log.debug('ImageKit auth fetched');
  return { token, expire, signature, publicKey };
};

export const uploadImageToImageKit = async (file, options = {}) => {
  if (!file) throw new Error('No file selected for upload.');
  log.info('Starting ImageKit upload', { fileName: file.name, folder: options.folder || null });

  const { token, expire, signature, publicKey } = await getUploadAuth();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', options.fileName || file.name);
  formData.append('useUniqueFileName', String(options.useUniqueFileName ?? true));
  formData.append('token', token);
  formData.append('expire', String(expire));
  formData.append('signature', signature);
  formData.append('publicKey', publicKey);

  if (options.folder) formData.append('folder', options.folder);
  if (options.tags?.length) formData.append('tags', options.tags.join(','));

  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    log.error('ImageKit upload failed', { fileName: file.name, status: response.status, error: errorText });
    throw new Error(errorText || 'ImageKit upload failed.');
  }

  const data = await response.json();
  log.info('ImageKit upload successful', { fileName: file.name, url: data?.url, fileId: data?.fileId });
  return data;
};

export const uploadFileToImageKit = (file, options = {}) =>
  uploadImageToImageKit(file, options);
