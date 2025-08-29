import { FormProps } from "antd";

export const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};