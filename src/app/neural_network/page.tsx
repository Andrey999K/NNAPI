"use client"

import { useSearchParams } from "next/navigation";
import { Button, Form, FormProps, message, Progress } from "antd";
import { UploadImage } from "@/components/UploadImage";
import { onFinishFailed } from "@/utils/function";
import { useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getJobInfo, sendPrompt } from "@/utils/api";
import { LoadingType } from "@/utils/types";
import { TimeElapsed } from "@/components/TimeElapsed";
import { Wrapper } from "@/components/Wrapper";
import { Loader } from "@/components/Loader";

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

  const blockFields = !resultImage && !!loading;

  const wfId = searchParams.get('wf_id');
  if (!wfId) return "А WF_ID где???????????";

  let fields: string | string[] = (searchParams.get('fields') || "[]").replaceAll("'", "\"");
  try {
    fields = JSON.parse(fields);
  } catch (error) {
    console.log(error);
  }

  const renderFields = (massFields: string[]) => {
    return massFields.map((field) => {
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
          });
      })
      .catch(error => console.log(error));
  };

  const downloadImage = async () => {
    if (!resultUrl) return;

    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'result.jpg';
      document.body.appendChild(link);
      link.click();

      // Очистка
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      message.success('Image downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download image');
    }
  };

  const resultUrl = resultImage
    ? `${process.env.NEXT_PUBLIC_API_URL}${resultImage.replaceAll("\\", "/")}`
    : "";

  return (
    <Wrapper>
      <div className="py-20">
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
          <div className="flex w-full justify-center items-center mt-20 flex-col">
            <a href={resultUrl} target="_blank">
              <img src={resultUrl} alt="" />
            </a>
            <Button type="primary" onClick={downloadImage}>
              Download
            </Button>
          </div>
        )}
      </div>
    </Wrapper>
  );
};