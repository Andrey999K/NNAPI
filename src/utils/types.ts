export type FieldType = {
  token: string;
  wf_id: string;
};

export type LoadingType = {
  node?: string,
  progress_max?: number,
  progress_value?: number,
  result: null | string,
  status: "running" | "failed" | "success" | "queued"
}

export type WorkflowConfig = {
  status?: "success" | string,
  template?: string[],
  workflow_id?: string,
  error?: string
}

export type JobInfoType = {
  job: {
    node?: string,
    progress_max?: number,
    progress_value?: number,
    result: null | string,
    status: "running" | "failed" | "success" | "queued",
  },
  job_id: string,
  status: "running" | "failed" | "success" | "queued"
}