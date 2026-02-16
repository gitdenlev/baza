
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/login.api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      router.push("/");
    }
  };
  const router = useRouter();

  return (
    <div className="flex w-full h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Вхід в акаунт
            </CardTitle>
            <CardDescription className="text-center">
              Введіть вашу пошту та пароль для входу
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Електронна пошта
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="password"
              >
                Пароль
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password" type="password" required />
            </div>
            <Button onClick={handleSubmit} className="w-full">Увійти</Button>
          </CardContent>
          <CardFooter>
            <p className="px-8 text-center text-sm text-muted-foreground w-full">
              Немає акаунту?{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                Реєстрація
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
