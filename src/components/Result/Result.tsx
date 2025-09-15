import { Button } from "antd";
import { useState } from "react";
import { Loader } from "@/components/Loader";
import Image from "next/image";

type ResultProps = {
  url: string;
  className?: string;
}

export const Result = ({url, className}: ResultProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const urlResult = `${process.env.NEXT_PUBLIC_API_URL}${url.replaceAll("\\", "/")}`;

  const downloadImage = async () => {
    if (!url) return;

    try {
      const response = await fetch(urlResult);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'result.jpg';
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className={"flex gap-5 w-full justify-center items-center flex-col " + className}>
      <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">Не удалось загрузить изображение</span>
          </div>
        )}
        <a href={urlResult} target="_blank" className="block w-full h-full">
          <Image
            src={urlResult}
            alt="Result"
            sizes="100%"
            width={400}
            height={400}
            className="w-full h-full"
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            style={{opacity: isLoading ? 0 : 1}}
          />
        </a>
      </div>
      <Button type="primary" onClick={downloadImage} disabled={isLoading}>
        Download
      </Button>
    </div>
  );
};