import axios from "axios";
import { isDev } from "@/utils/isDev";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // timeout: 5000
});

// Основная функция для запросов
export const fetchData = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: object,
  auth: boolean = false,
  token?: string
) => {
  try {
    const currentToken = typeof window !== 'undefined'
      ? (localStorage.getItem('authToken') || `${token}`)
      : null;

    // Формируем заголовки
    const headers: Record<string, string> = {};
    if (auth) headers.Authorization = `bearer ${currentToken}`;

    // Выполняем запрос
    const response = await axiosInstance({
      url,
      method,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    if (isDev()) {
      console.log(error);
    }
  }
};