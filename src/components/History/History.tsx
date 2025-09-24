import { useEffect, useState } from "react";
import { Result } from "@/components/Result/Result";
import { ResultType } from "@/utils/types";

type HistoryProps = {
  lastResult: ResultType;
};

export const History = ({ lastResult }: HistoryProps) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (typeof lastResult === "string") {
      setHistory(
        [
          lastResult,
          ...JSON.parse(localStorage.getItem("history") || "[]"),
        ].filter(Boolean)
      );
    }
  }, [lastResult]);

  // помещение истории в localStorage
  useEffect(() => {
    if (history.length) {
      localStorage.setItem("history", JSON.stringify(history));
    }
  }, [history]);

  return (
    <div className="mt-20">
      <h3 className="text-3xl">History</h3>
      {history.map((result) => (
        <Result
          key={result}
          url={result}
          className="mt-5 w-full max-w-[300px] h-[200px] !flex-row"
        />
      ))}
    </div>
  );
};
