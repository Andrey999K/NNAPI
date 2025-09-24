"use client";

import { useState } from "react";
import { LoadingType, ResultType } from "@/utils/types";
import { TimeElapsed } from "@/components/TimeElapsed";
import { Wrapper } from "@/components/Wrapper";
import { History } from "@/components/History";
import { Result } from "@/components/Result/Result";
import { NotificationAudio } from "@/components/NotificationAudio";
import { ProgressResult } from "@/components/ProgressResult";
import { FormNeuralNetwork } from "@/components/FormNeuralNetwork";

export default function NeuralNetworkPage() {
  const [result, setResult] = useState<ResultType>(null);
  const [loading, setLoading] = useState<undefined | LoadingType>(undefined);
  const [playNotification, setPlayNotification] = useState<boolean>(false);

  return (
    <>
      <Wrapper>
        <div className="py-20">
          <FormNeuralNetwork
            loading={loading}
            setLoading={setLoading}
            setPlayNotification={setPlayNotification}
            setResult={setResult}
          />
          {!result && loading && loading.status === "running" && (
            <div className="mt-10 w-full max-w-[440px] mx-auto">
              <TimeElapsed />
              <ProgressResult loading={loading} />
            </div>
          )}
          <NotificationAudio
            play={playNotification}
            setPlay={setPlayNotification}
          />
          {result && typeof result === "string" && (
            <Result
              url={result}
              className="mt-20 w-full max-w-[400px] max-h-[440px] !gap-2 !flex-col"
            />
          )}
          <div className="mt-5">
            <History lastResult={result} />
          </div>
        </div>
      </Wrapper>
    </>
  );
}
