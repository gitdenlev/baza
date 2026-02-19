"use client";

import { useState, useMemo } from "react";
import { login } from "@/lib/login.api";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login error. Please try again.";
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-full sm:w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Log in
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/30 rounded-md p-2">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="email"
              >
                Email address
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
                className="text-sm font-medium leading-none"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Log in"}
            </Button>
          </CardContent>
        </form>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground w-full">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
