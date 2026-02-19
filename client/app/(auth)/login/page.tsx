"use client";

import LoginForm from "@/components/LoginForm/LoginForm";


export default function LoginPage() {
  return (
    <div className="flex w-full h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}