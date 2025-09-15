"use client"

import { Button, Form, FormProps, Input, Select } from "antd";
import { getConfiguration, getWorkflowsWithoutToken, getWorkflowsWithToken } from "@/utils/api";
import { useRouter } from "next/navigation";
import { FieldType } from "@/utils/types";
import { onFinishFailed } from "@/utils/function";
import { ChangeEvent, useEffect, useState } from "react";
import { PageLoader } from "@/components/PageLoader";

const {Option} = Select;

export default function Home() {
  const [workflows, setWorkflows] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    setLoading(true);
    getConfiguration(values.token, values.wf_id)
      .then(result => {
        setLoading(false);
        console.log("result", JSON.stringify(result.template));
        if (values.token) {
          localStorage.setItem("authToken", values.token);
        }
        localStorage.setItem("fields", JSON.stringify(result.template));
        router.push(`/neural_network?wf_id=${values.wf_id}`);
        // router.push(`/neural_network?wf_id=${values.wf_id}&fields=${JSON.stringify(result.template)}`);
      });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const token = e.target.value;
      console.log(token);
      getWorkflowsWithToken(token)
        .then(r => setWorkflows(r.workflows));
    }
  };

  useEffect(() => {
    getWorkflowsWithoutToken()
      .then(r => setWorkflows(r.workflows))
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      form.setFieldsValue({token, wfId: ""})
    }
  }, []);

  return (
    <div className="font-sans items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="w-full flex flex-col gap-2 row-start-2 items-center h-full justify-center">
        {loading && <PageLoader />}
        <Form
          name="basic"
          form={form}
          initialValues={{remember: true}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="w-full max-w-[400px] flex gap-2 items-center justify-center m-auto justify-center"
        >
          <Form.Item<FieldType>
            name="token"
            rules={[{message: 'Please input your token!'}]}
            className="w-full"
          >
            <Input.Password placeholder="Token" onBlur={handleBlur} />
          </Form.Item>

          <Form.Item
            name="wf_id"
            rules={[{required: true, message: 'Please input wf_id!'}]}
            className="w-full"
          >
            <Select
              placeholder="Workflow id"
              allowClear
              loading={!workflows.length}
            >
              {workflows.map((workflow) => (
                <Option key={workflow} value={workflow}>{workflow}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={null} className="w-full">
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}
