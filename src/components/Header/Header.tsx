'use client';

import Link from 'next/link';

export const Header = () => {

  return (
    <header>
      <nav>
        <Link href="/">
          Главная
        </Link>
      </nav>
    </header>
  );
}