"use client"

import { Button, Form, FormProps, Input } from "antd";
import { getConfiguration } from "@/utils/api";
import { useRouter } from "next/navigation";
import { FieldType } from "@/utils/types";
import { onFinishFailed } from "@/utils/function";

export default function Home() {

  const router = useRouter();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    getConfiguration(values.token, values.wfId)
      .then(result => {
        console.log("result", JSON.stringify(result.template));
        localStorage.setItem("authToken", values.token);
        router.push(`/neural_network?wf_id=${values.wfId}&fields=${JSON.stringify(result.template)}`);
        // 'image', 'prompt'
      });
  };
  // const handleSend = () => {
  //   getConfiguration
  // }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start h-full">
        {/*<div className="flex items-center gap-2">*/}
        {/*  <Input placeholder="Token" />*/}
        {/*  <Input placeholder="Workflow ID" />*/}
        {/*  <Button type="primary">Send</Button>*/}
        {/*</div>*/}
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="flex gap-2 items-center justify-center"
        >
          <Form.Item<FieldType>
            name="token"
            rules={[{ required: true, message: 'Please input your token!' }]}
          >
            <Input placeholder="Token" />
          </Form.Item>

          <Form.Item<FieldType>
            name="wfId"
            rules={[{ required: true, message: 'Please input wf_id!' }]}
          >
            <Input placeholder="Workflow ID" />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}
