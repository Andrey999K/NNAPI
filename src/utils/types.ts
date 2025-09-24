export type FieldType = {
  token: string;
  wf_id: string;
};

export type ResultType =
  | null
  | string
  | {
      position: number;
    };

export type Status = "running" | "failed" | "success" | "queued";

export type LoadingType = {
  node?: string;
  progress_max?: number;
  progress_value?: number;
  result: ResultType;
  status: Status;
};

export type WorkflowConfig = {
  status?: "success" | string;
  template?: string[];
  workflow_id?: string;
  error?: string;
};

export type JobInfoType = {
  job: {
    node?: string;
    progress_max?: number;
    progress_value?: number;
    result: ResultType;
    status: Status;
  };
  job_id: string;
  status: Status;
};
