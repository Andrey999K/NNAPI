import { useEffect, useState } from "react";
import { Result } from "@/components/Result/Result";

export const History = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("history") || "[]"));
  }, []);

  return (
    <div className="mt-20">
      <h3 className="text-3xl">History</h3>
      {
        history.map(
          result =>
            <Result
              key={result}
              url={result}
              className="mt-5 w-full max-w-[300px] h-[200px] !flex-row"
            />
        )
      }
    </div>

  );
};