import { ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="w-full max-w-screen-lg mx-auto">
      {children}
    </div>
  );
};