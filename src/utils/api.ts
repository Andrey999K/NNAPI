import { fetchData } from "@/api/axios-config";
import { Dispatch, SetStateAction } from "react";
import {
  JobInfoType,
  LoadingType,
  ResultType,
  WorkflowConfig,
} from "@/utils/types";

export const getConfiguration = async (
  token: string,
  wfId: string
): Promise<WorkflowConfig> => {
  // const wf_id = "big_head";
  // const wf_id = "bg_remove";
  return await fetchData(`/get_workflow?wf_id=${wfId}`, "GET", {}, true, token);
};

export const sendPrompt = async (
  wf_id: string,
  args: Record<string, string>
) => {
  const token = localStorage.getItem("authToken");
  let fields = "";
  for (const arg in args) {
    fields += `&${arg}=${args[arg]}`;
  }

  return await fetchData(
    `/start_run?workflow_id=${wf_id}${fields}`,
    "POST",
    {},
    true,
    token || ""
  );
};

export const getJobInfo = async (
  jobId: string,
  setLoading: Dispatch<SetStateAction<LoadingType | undefined>>
): Promise<ResultType> => {
  const token = localStorage.getItem("authToken");

  const checkJobStatus = async (): Promise<ResultType> => {
    try {
      const response: JobInfoType = await fetchData(
        `/job_info?job_id=${jobId}`,
        "GET",
        {},
        true,
        token || ""
      );

      localStorage.setItem("job_info", JSON.stringify(response));

      setLoading(response.job);

      if (response.job.status === "success" && response.job.result) {
        return response.job.result;
      }
      if (response.job.status === "failed") {
        return response.job.result;
      }
    } catch (error) {
      console.error("Job status check failed:", error);
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(checkJobStatus()), 1000);
    });
  };

  return await checkJobStatus();
};

export const getWorkflowsWithoutToken = async () => {
  return await fetchData(`/get_workflows`, "GET", {}, true, "");
};

export const getWorkflowsWithToken = async (token: string) => {
  return await fetchData(`/get_workflows`, "GET", {}, true, token);
};
