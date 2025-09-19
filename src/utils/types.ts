export type FieldType = {
  token: string;
  wf_id: string;
};

export type LoadingType = {
  node?: string,
  progress_max?: number,
  progress_value?: number,
  result: null,
  status: "running" | "failed" | "success"
}

export type WorkflowConfig = {
  status?: "success" | string,
  template?: string[],
  workflow_id?: string,
  error?: string
}