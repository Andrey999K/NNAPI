import { FormProps } from "antd";

export const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export const convertToObject = (mass: string[]): Record<string, string> => {
  return mass.reduce((acc: Record<string, string>, key) => {
    acc[key] = "";
    return acc;
  }, {});
};