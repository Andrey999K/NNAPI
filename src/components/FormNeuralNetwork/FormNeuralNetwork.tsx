import { useUrlFields } from "@/hooks/useUrlFields";
import { Button, Form, FormProps, Modal, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadImage } from "@/components/UploadImage";
import { UploadAudio } from "@/components/UploadAudio";
import { onFinishFailed } from "@/utils/function";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getJobInfo, sendPrompt } from "@/utils/api";
import { LoadingType, ResultType } from "@/utils/types";

type FormNeuralNetworkProps = {
  loading: undefined | LoadingType;
  setLoading: Dispatch<SetStateAction<LoadingType | undefined>>;
  setPlayNotification: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<ResultType>>;
};

export const FormNeuralNetwork = ({
  loading,
  setLoading,
  setPlayNotification,
  setResult,
}: FormNeuralNetworkProps) => {
  const { wfId, getFieldsFromUrl, updateURLFields } = useUrlFields();
  const [form] = Form.useForm();
  const [fieldsFiles, setFieldsFiles] = useState<Record<string, string>>({});
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [isModalContinueJob, setIsModalContinueJob] = useState(false);

  const fields = getFieldsFromUrl();
  const { fileFields } = Object.entries(fields).reduce(
    (acc, [key, value]) => {
      if (key.endsWith("_file")) {
        acc.fileFields[key] = value;
      }
      return acc;
    },
    {
      fileFields: {} as Record<string, string>,
    }
  );

  const blockFields = !!loading && loading.status === "running";
  const blockSendForm =
    !checkUploadFiles() || (!!loading && loading.status === "running");

  function checkUploadFiles() {
    for (const field in fileFields) {
      if (fileFields[field] === "") {
        return false;
      }
    }
    return true;
  }

  const handleBlur = () => {
    updateURLFields({ ...form.getFieldsValue(), ...fieldsFiles });
  };

  const renderFields = (massFields: Record<string, string>) => {
    return Object.keys(massFields).map((field) => {
      if (!field.endsWith("_file")) {
        return (
          <Form.Item
            name={field}
            key={field}
            rules={[{ required: true, message: `Please input ${field}!` }]}
            className="!mb-0"
            label={field}
            layout="vertical"
          >
            <TextArea
              placeholder={field}
              rows={1}
              disabled={blockFields}
              name={field}
              onBlur={handleBlur}
            />
          </Form.Item>
        );
      } else if (field.startsWith("image_file")) {
        return (
          <UploadImage
            key={field}
            imagePath={fields[field]}
            field={field}
            updateFieldsFiles={setFieldsFiles}
            disabled={blockFields}
          />
        );
      } else if (field === "audio_file") {
        return <UploadAudio key={field} />;
      }
    });
  };

  const getJob = (
    jobId: string,
    setLoading: Dispatch<SetStateAction<LoadingType | undefined>>
  ) => {
    getJobInfo(jobId, setLoading).then((res) => {
      if (res) {
        setPlayNotification(true);
        setResult(res);
      }
    });
  };

  const onFinish: FormProps["onFinish"] = (values) => {
    const data = { ...values, ...fieldsFiles };
    console.log("values", values);
    console.log("fieldsFiles", fieldsFiles);

    setResult(null);
    setLoading({
      result: null,
      status: "running",
    });
    sendPrompt(wfId, data)
      .then((res) => {
        getJob(res.job_id, setLoading);
      })
      .catch((error) => {
        console.log(error);
        notificationApi.error({ message: "Ошибка при отправке запроса" });
      });
  };

  useEffect(() => {
    form.setFieldsValue(fields);
    setFieldsFiles(fileFields);
  }, []);

  useEffect(() => {
    if (Object.keys(fieldsFiles).length !== 0) {
      updateURLFields({ ...form.getFieldsValue(), ...fieldsFiles });
    }
  }, [fieldsFiles]);

  // запуск уведомления об падении workflow
  useEffect(() => {
    if (loading?.status === "failed") {
      notificationApi.error({ message: "Workflow failed" });
    }
  }, [loading, notificationApi]);

  if (!wfId) return "А WF_ID где???????????";

  return (
    <>
      <Modal
        title="Ожидается результат"
        closable={false}
        open={isModalContinueJob}
        onOk={() => setIsModalContinueJob(false)}
        cancelButtonProps={{ hidden: true }}
        centered={true}
      ></Modal>
      {notificationContextHolder}
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex flex-col gap-12 justify-center max-w-[440px] !mx-auto"
        requiredMark={false}
      >
        {renderFields(fields)}
        <Form.Item label={null} className="!mb-0">
          <Button type="primary" htmlType="submit" disabled={blockSendForm}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
