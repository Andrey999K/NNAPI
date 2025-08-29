import axios from "axios";
import { isDev } from "@/utils/isDev";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_TOKEN,
//   withCredentials: true,
// });
//
// const customFetch = async (url: string, method?: "GET" | "POST", body?: object, auth?: boolean) => {
//   try {
//     const token = localStorage.getItem("authToken");
//     const headers = auth ? {Authorization: token} : null;
//     const config = headers ? {headers} : {};
//     let response;
//     if (method === "POST") {
//       response = await axiosInstance.post(url, body, config);
//     } else {
//       response = await axiosInstance.get(url, config);
//     }
//     if (response.status === 200) {
//       return response.data.result;
//     }
//     if (isDev()) {
//       console.log("response", response);
//     }
//     return "Error";
//   } catch (error) {
//     if (isDev()) {
//       console.log(error);
//     }
//   }
// };

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
    if (auth && currentToken) headers.Authorization = `bearer ${currentToken}`;

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