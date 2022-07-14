export const configuration = {
  NODE_ENV: process.env.NODE_ENV,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  delay: Number(process.env.NEXT_PUBLIC_AXIOS_DELAY) || 0
};
