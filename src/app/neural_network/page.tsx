"use client"

import { useSearchParams } from "next/navigation";
import { Button, Form, FormProps, notification, Progress } from "antd";
import { UploadImage } from "@/components/UploadImage";
import { onFinishFailed } from "@/utils/function";
import { useEffect, useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getJobInfo, sendPrompt } from "@/utils/api";
import { LoadingType } from "@/utils/types";
import { TimeElapsed } from "@/components/TimeElapsed";
import { Wrapper } from "@/components/Wrapper";
import { Loader } from "@/components/Loader";
import { History } from "@/components/History";
import { Result } from "@/components/Result/Result";

type FieldType = {
  prompt?: string;
  image?: string;
}

export default function NeuralNetworkPage() {
  const searchParams = useSearchParams();
  const [imagePath, setImagePath] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<undefined | LoadingType>(undefined);
  const notificationAudio = useRef<HTMLAudioElement | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [form] = Form.useForm();

  const [notificationApi, notificationContextHolder] = notification.useNotification();

  const blockFields = !resultImage && !!loading;

  const wfId = searchParams.get('wf_id');

  const fields = JSON.parse(searchParams.get("fields") || "{}");

  useEffect(() => {
    if (loading?.status === "failed") {
      notificationApi.error({message: "Workflow failed"});
    }
  }, [loading, notificationApi]);

  useEffect(() => {
    if (history.length) {
      localStorage.setItem("history", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("history") || "[]"));
  }, []);

  useEffect(() => {
    form.setFieldsValue(fields);
  }, [fields, form]);

  if (!wfId) return "А WF_ID где???????????";

  const renderFields = (massFields: Record<string, string>) => {
    return Object.keys(massFields).map((field) => {
      if (field !== "image") {
        return (
          <Form.Item
            name={field}
            key={field}
            rules={[{required: true, message: `Please input ${field}!`}]}
          >
            <TextArea placeholder={field} rows={8} disabled={blockFields} />
          </Form.Item>
        );
      }
      if (field === "image") {
        return <UploadImage key={field} setImagePath={setImagePath} disabled={blockFields} />;
      }
    })
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const data = {...values, image: imagePath};
    setResultImage(null);
    setLoading({
      result: null,
      status: "running"
    });
    sendPrompt(wfId, data)
      .then(result => {
        getJobInfo(result.job_id, setLoading)
          .then((res) => {
            const audioElem = notificationAudio.current;
            if (audioElem) {
              audioElem.volume = 0.2;
              audioElem.play();
            }
            setResultImage(res);
            setHistory((prevState) => [...prevState, res]);
          });
      })
      .catch(error => {
        console.log(error);
        notificationApi.error({message: 'Ошибка при отправке запроса'});
      });
  };

  return (
    <>
      {notificationContextHolder}
      <Wrapper>
        <div className="py-20">
          <Form
            form={form}
            name="basic"
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="flex flex-col gap-2 justify-center max-w-[440px] !mx-auto"
          >
            {renderFields(fields)}
            <Form.Item label={null} className="!mb-0">
              <Button type="primary" htmlType="submit" disabled={blockFields}>
                Submit
              </Button>
            </Form.Item>
          </Form>
          {!resultImage && loading && loading.status !== "success" && (
            <div className="mt-10 w-full max-w-[440px] mx-auto">
              <TimeElapsed />
              <div
                className="flex items-center justify-center gap-5 h-[140px] border-solid
            border-gray-300 border-[1px] rounded-md p-5"
              >
                <Loader />
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
          <audio src="/ding-36029.mp3" ref={notificationAudio}></audio>
          {resultImage && (
            <Result url={resultImage} className="mt-20" />
          )}
          {history && (
            <div className="mt-5">
              <History />
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};