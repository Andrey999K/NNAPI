import { Button } from "antd";

type ResultProps = {
  url: string;
  className?: string;
}

export const Result = ({url, className}: ResultProps) => {
  const urlResult = `${process.env.NEXT_PUBLIC_API_URL}${url.replaceAll("\\", "/")}`;
  console.log("result", urlResult);

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
    <div className={"flex w-full justify-center items-center flex-col " + className}>
      <a href={urlResult} target="_blank" className="block w-full h-full">
        <img src={urlResult} alt="" className="block w-full h-full object-contain" />
      </a>
      <Button type="primary" onClick={downloadImage} className="mt-5">
        Download
      </Button>
    </div>
  );
};