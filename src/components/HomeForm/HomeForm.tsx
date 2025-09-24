"use client";

import { PageLoader } from "@/components/PageLoader";
import { Button, Form, FormProps, Input, notification, Select } from "antd";
import { onFinishFailed } from "@/utils/function";
import { FieldType } from "@/utils/types";
import { ChangeEvent, useEffect, useState } from "react";
import {
  getConfiguration,
  getWorkflowsWithoutToken,
  getWorkflowsWithToken,
} from "@/utils/api";
import { useRouter } from "next/navigation";

const { Option } = Select;

export const HomeForm = () => {
  const [workflows, setWorkflows] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setLoading(true);
    getConfiguration(values.token, values.wf_id).then((result) => {
      if (result.template) {
        setLoading(false);

        const fields = result.template.reduce(
          (acc: Record<string, string>, key) => {
            acc[key] = "";
            return acc;
          },
          {}
        );

        if (values.token) {
          localStorage.setItem("authToken", values.token);
        }
        localStorage.setItem("fields", JSON.stringify(fields));
        // router.push(`/neural_network?wf_id=${values.wf_id}`);
        console.log("home fields", fields);
        router.push(
          `/neural_network?wf_id=${values.wf_id}&fields=${JSON.stringify(fields)}`
        );
      } else {
        notification.error({ message: "Произошла непредвиденная ошибка!" });
      }
    });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const token = e.target.value;
      console.log(token);
      getWorkflowsWithToken(token).then((r) => setWorkflows(r.workflows));
    }
  };

  useEffect(() => {
    getWorkflowsWithoutToken().then((r) => setWorkflows(r.workflows));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      form.setFieldsValue({ token, wfId: "" });
    }
  }, []);

  return (
    <>
      {loading && <PageLoader />}
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-full max-w-[400px] flex gap-2 items-center justify-center m-auto justify-center"
      >
        <Form.Item<FieldType>
          name="token"
          rules={[{ message: "Please input your token!" }]}
          className="w-full"
        >
          <Input.Password placeholder="Token" onBlur={handleBlur} />
        </Form.Item>

        <Form.Item
          name="wf_id"
          rules={[{ required: true, message: "Please input wf_id!" }]}
          className="w-full"
        >
          <Select
            placeholder="Workflow id"
            allowClear
            loading={!workflows.length}
          >
            {workflows.map((workflow) => (
              <Option key={workflow} value={workflow}>
                {workflow}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={null} className="w-full">
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
