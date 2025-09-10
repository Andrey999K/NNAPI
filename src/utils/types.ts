export type FieldType = {
  token: string;
  wf_id: string;
};

export type LoadingType = {
  node?: string,
  progress_max?: number,
  progress_value?: number,
  result: null,
  status: string
}