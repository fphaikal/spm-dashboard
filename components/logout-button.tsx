"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { deleteToken } from "@/app/action/logout";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async() => {
    deleteToken({});
    router.push('/')
  };

  return (
    <Button
      onClick={handleLogout} 
      color="default"
    >
      Logout
    </Button>
  );
}
