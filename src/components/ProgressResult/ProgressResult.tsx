import { Loader } from "@/components/Loader";
import { Progress } from "antd";
import { LoadingType } from "@/utils/types";

type ProgressResultProps = {
  loading: undefined | LoadingType;
};

export const ProgressResult = ({ loading }: ProgressResultProps) => {
  return (
    <div
      className="flex items-center justify-center gap-5 h-[140px] border-solid
            border-gray-300 border-[1px] rounded-md p-5"
    >
      <Loader />
      {loading?.node && (
        <>
          <div className="text-xl w-full max-w-26 text-center">
            Node {loading.node}
          </div>
          <Progress
            percent={
              loading?.progress_value && loading.progress_max
                ? Math.floor(
                    (loading.progress_value / loading.progress_max) * 100
                  )
                : 0
            }
            status="active"
            percentPosition={{ align: "center", type: "outer" }}
            size={[NaN, 20]}
          />
        </>
      )}
    </div>
  );
};
