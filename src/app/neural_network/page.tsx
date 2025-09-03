"use client"

import { useSearchParams } from "next/navigation";
import { Button, Form, FormProps, Input } from "antd";
import { UploadImage } from "@/components/UploadImage";
import { onFinishFailed } from "@/utils/function";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getJobInfo, sendPrompt } from "@/utils/api";
import Image from "next/image";

type FieldType = {
  prompt?: string;
  image?: string;
}

export default function NeuralNetworkPage() {
  const searchParams = useSearchParams();
  const [imagePath, setImagePath] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);

  const wfId = searchParams.get('wf_id');
  if (!wfId) return "А WF_ID где???????????";

  let fields: string | string[] = (searchParams.get('fields') || "[]").replaceAll("'", "\"");
  try {
    fields = JSON.parse(fields);
  }
  catch(error) {
    console.log(error);
  }

  console.log("fields", fields);

  // const renderFields = (massFields: string[]) => {
  //   return massFields.map((field) => {
  //     if (field === "prompt") {
  //       return <Input key={field} placeholder={field} />;
  //     }
  //     if (field === "image") {
  //       return <UploadImage key={field} />;
  //     }
  //   })
  // }

  const renderFields = (massFields: string[]) => {
    return massFields.map((field) => {
      if (field !== "image") {
        return (
          <Form.Item
            name={field}
            key={field}
            rules={[{ required: true, message: `Please input ${field}!` }]}
          >
            <TextArea placeholder={field} rows={8} />
          </Form.Item>
        );
      }
      if (field === "image") {
        return <UploadImage key={field} setImagePath={setImagePath} />;
      }
    })
  }

  console.log("resultImage", resultImage)

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    // console.log('Success:', values);
    const data = { ...values, image: imagePath };
    // console.log(data);
    // sendPrompt(wf_id, data?.prompt, data?.image)
    sendPrompt(wfId, data)
      .then(result => {
        console.log("result", result.job_id);
        getJobInfo(result.job_id)
          .then(res => {
            console.log("res", res);
            setResultImage(res);
          })
      })
      .catch(error => console.log(error));
    // getConfiguration(values.token, values.wf_id)
    //   .then(result => {
    //     console.log("result", result);
    //   });
  };

  return (
    <div className="py-20">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex flex-col gap-2 justify-center max-w-[400px] !mx-auto"
      >
        {renderFields(fields as string[])}
        <Form.Item label={null} className="!mb-0">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {resultImage && (
        <div className="">
          <img src={`${process.env.NEXT_PUBLIC_API_URL}${resultImage.replaceAll("\\", "/")}`} alt="" />
        </div>
      )}
    </div>
  );
};