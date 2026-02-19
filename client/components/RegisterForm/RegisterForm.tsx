"use client";

import { useState } from "react";
import { register } from "@/lib/register.api";
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

export default function RegisterForm() {
  const [name, setName] = useState("");
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
      await register(name, email, password);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Registration error. Please try again.";
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign up
          </CardTitle>
          <CardDescription className="text-center">
            Create a new account
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
                htmlFor="name"
              >
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                type="text"
                placeholder="Your name"
                required
                maxLength={22}
              />
            </div>
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
                placeholder="Min 8 characters"
                required
              />
              <p className="text-xs text-muted-foreground">
                Min 8 characters, 1 uppercase, 1 number, 1 special char
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Sign up"}
            </Button>
          </CardContent>
        </form>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
