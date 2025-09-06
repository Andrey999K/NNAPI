"use client"

import { useSearchParams } from "next/navigation";
import { Button, Form, FormProps, Input, Modal, Progress, Spin } from "antd";
import { UploadImage } from "@/components/UploadImage";
import { onFinishFailed } from "@/utils/function";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getJobInfo, sendPrompt } from "@/utils/api";
import { LoadingOutlined } from "@ant-design/icons";
import { LoadingType } from "@/utils/types";

type FieldType = {
  prompt?: string;
  image?: string;
}

export default function NeuralNetworkPage() {
  const searchParams = useSearchParams();
  const [imagePath, setImagePath] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<undefined | LoadingType>(undefined);

  const blockFields = !resultImage && !!loading;

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

  const renderFields = (massFields: string[]) => {
    return massFields.map((field) => {
      if (field !== "image") {
        return (
          <Form.Item
            name={field}
            key={field}
            rules={[{ required: true, message: `Please input ${field}!` }]}
          >
            <TextArea placeholder={field} rows={8} disabled={blockFields} />
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
    setResultImage(null);
    setLoading({
      result: null,
      status: "running"
    });
    sendPrompt(wfId, data)
      .then(result => {
        console.log("result", result.job_id);
        getJobInfo(result.job_id, setLoading)
          .then((res) => {
            console.log("res", res);
            setResultImage(res);
          });
      })
      .catch(error => console.log(error));
    // getConfiguration(values.token, values.wf_id)
    //   .then(result => {
    //     console.log("result", result);
    //   });
  };

  return (
    <div className="py-20">
      {/*{loading && (*/}
      {/*  <Modal*/}
      {/*    centered*/}
      {/*    open={loading}*/}
      {/*    // onOk={() => setLoading(false)}*/}
      {/*    // onCancel={() => setLoading(false)}*/}
      {/*    cancelButtonProps={{hidden: true}}*/}
      {/*    okButtonProps={{hidden: true}}*/}
      {/*    closable={false}*/}
      {/*    maskClosable={false}*/}
      {/*    footer={null}*/}
      {/*    className="w-full max-w-[400px] mx-auto"*/}
      {/*  >*/}
      {/*    <div className="w-full flex items-center justify-between gap-5 h-[100px]">*/}
      {/*      <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin />} />*/}
      {/*      <div className="text-xl w-full max-w-26 text-center">Node 178</div>*/}
      {/*      <Progress*/}
      {/*        percent={100}*/}
      {/*        status="active"*/}
      {/*        percentPosition={{align: 'center', type: 'inner'}}*/}
      {/*        size={[NaN, 20]}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </Modal>*/}
      {/*)}*/}
      <Form
        name="basic"
        initialValues={{remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex flex-col gap-2 justify-center max-w-[440px] !mx-auto"
      >
        {renderFields(fields as string[])}
        <Form.Item label={null} className="!mb-0">
          <Button type="primary" htmlType="submit" disabled={blockFields}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {!resultImage && loading && loading.status !== "success" && (
        <div className="mt-10">
          <div
            className="w-full max-w-[440px] mx-auto flex items-center justify-center gap-5 h-[140px] border-solid
          border-gray-300 border-[1px] rounded-md p-5"
          >
            <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin />} />
            {
              loading?.node && (
                <>
                  <div className="text-xl w-full max-w-26 text-center">Node {loading.node}</div>
                  <Progress
                    percent={
                      (loading?.progress_value && loading.progress_max)
                        ? Math.floor(loading.progress_value / loading.progress_max * 100)
                        : 0
                    }
                    status="active"
                    percentPosition={{align: 'center', type: 'outer'}}
                    size={[NaN, 20]}
                  />
                </>
              )
            }
          </div>
        </div>
      )}
      {resultImage && (
        <div className="flex w-full justify-center mt-20">
          <img src={`${process.env.NEXT_PUBLIC_API_URL}${resultImage.replaceAll("\\", "/")}`} alt="" />
        </div>
      )}
    </div>
  );
};