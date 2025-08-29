import { fetchData } from "@/api/axios-config";


export const getConfiguration = async (token: string, wfId: string) => {
  // const wfId = "big_head";
  // const wfId = "bg_remove";
  return await fetchData(
    `/get_workflow?wf_id=${wfId}`,
    "GET",
    {},
    true,
    token
  );
}


export const sendPrompt = async (wf_id: string, args: Record<string, string>) => {
  const token = localStorage.getItem('authToken');
  console.log("args", args);
  if (token) {
    let fields = "";
    for (const arg in args) {
      fields += `&${arg}=${args[arg]}`;
    }
    return await fetchData(
      `/start_run?workflow_id=${wf_id}${fields}`,
      "POST",
      {},
      true,
      token
    );
  }
}

// export const getJobInfo = async (jobId: string) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     const timer = setInterval(async () => {
//       const response = await fetchData(
//         `/job_info?job_id=${jobId}`,
//         "GET",
//         {},
//         true,
//         token
//       );
//       if (response.job.status === "success") {
//         clearInterval(timer);
//       }
//     }, 1000);
//   }
// }

export const getJobInfo = async (jobId: string) => {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  const checkJobStatus = async (): Promise<void> => {

    try {
      const response = await fetchData(
        `/job_info?job_id=${jobId}`,
        "GET",
        {},
        true,
        token
      );

      if (response.job.status === "success") {
        return response.job.result; // Завершаем при успехе
      }
    } catch (error) {
      console.error("Job status check failed:", error);
    }

    // Рекурсивно вызываем себя через промис
    return new Promise(resolve => {
      setTimeout(() => resolve(checkJobStatus()), 1000);
    });
  };

  // Запускаем процесс
  const result = await checkJobStatus();
  console.log("result1", result);
  return result;
};


// export const getConfiguration = async (token: string): Promise<ConfigurationData> => {
//   // const wfId = "big_head";
//   const wfId = "bg_remove";
//   const response = await customFetch(
//     `/get_workflow?wf_id=${wfId}`,
//     "GET",
//     {},
//     true,
//     token || `bearer ${process.env.NEXT_PUBLIC_TOKEN}`
//   ); // Добавлен await
//   console.log("response", response);
//
//   // Гарантируем, что возвращаемое значение не undefined
//   if (response === undefined) {
//     throw new Error("Received undefined from API");
//   }
//
//   return response;
// };