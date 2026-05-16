export const fallbackImages = {
  car: '',
  accessory: '',
  service: ''
};

export const getSafeImage = (url) => {
  if (!url || typeof url !== 'string') return '';
  return url.trim();
};

