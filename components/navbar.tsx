"use client"

import Image from "next/image";
import Logo from "@/app/public/logo.svg";
import {Button} from "@/components/ui/button";
import {ExitIcon} from "@radix-ui/react-icons";
import {deleteCookie, getCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const token = getCookie("jwt-token");
  const [me, setMe] = useState();

  const exit = () => {
    deleteCookie('jwt-token');
    router.replace('/');
  }

  const getMe = async () => {
    const response = await fetch('/api/me/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setMe(data.username);
    }
  }

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <nav className="flex items-center justify-between container mx-auto border-b py-4">
      <div className="flex items-center gap-x-16">
        <Image src={Logo} alt="logo"/>
        <div className="flex items-center gap-x-4">
          <Link
            href="/dashboard"
            className="underline"
          >
            Администраторы
          </Link>
          <Link
            href="/dashboard/user"
            className="underline"
          >
            Пользователи
          </Link>
          <Link
            href="/dashboard"
            className="underline"
          >
            Чекапы
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <p>Добро пожаловать <span className="font-semibold capitalize underline">{ me }</span></p>
        <Button
          className="gap-x-1"
          onClick={exit}
        >
          Выйти
          <ExitIcon />
        </Button>
      </div>
    </nav>
  )
}

export default Navbar;
