'use client';

import Link from 'next/link';
import { Button } from "antd";
import { Wrapper } from "@/components/Wrapper";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <header className="py-6">
      <Wrapper>
        <div className="flex items-center justify-between">
          <nav>
            <Link href="/">
              Главная
            </Link>
          </nav>
          <Button type="primary" onClick={handleLogout}>Выход</Button>
        </div>
      </Wrapper>
    </header>
  );
}