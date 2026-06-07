export const fallbackImages = {
  car: '/demo-images/cars/001-toyota-camry-2-5q.jpg',
  accessory: '/demo-images/accessories/011-camera-hanh-trinh-70mai-a500s.jpg',
  service: '/demo-images/services/001-bao-duong-dinh-ky-5-000-km.jpg'
};

export const getSafeImage = (url, type = 'car') => {
  const fallback = fallbackImages[type] || fallbackImages.car;
  if (!url || typeof url !== 'string') return fallback;

  const trimmedUrl = url.trim();
  return trimmedUrl || fallback;
};

