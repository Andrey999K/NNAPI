import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const Loader = () => {
  return (
    <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin />} />
  );
};