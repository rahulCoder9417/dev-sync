"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { signUpSchema } from "@/schema/signUpSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { saveUserToDB } from "@/lib/actions/userActions";
import { showToast } from "../main/Toast";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/features/userSlice";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", passwordConfirmation: "", username: "", fullName: "" },
  });



  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded || !data) return;
    setIsSubmitting(true); setAuthError(null);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      console.error("Clerk signUp error:", err);
      setAuthError(err.errors?.[0]?.message || "Sign‑up failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    let resp: any;
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true); setVerificationError(null);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        resp = await saveUserToDB({
          fullName: form.getValues("fullName"),
          email: form.getValues("email"),
          username: form.getValues("username"),
          password: form.getValues("password"),
          passwordConfirmation: form.getValues("passwordConfirmation"),
        });
        if (resp.success && resp.user) {
          dispatch(setUser({
            fullName: resp.user.fullName,
            email: resp.user.email,
            id:resp.user.id,
            username: resp.user.username,
            isAuthenticated: true,
          }));
          await setActive({ session: res.createdSessionId });
          router.push("/");
        }
      } else throw new Error("Incomplete");
    } catch (err: any) {
      setVerificationError(err.errors?.[0]?.message || "Verification failed.");
    } finally {
      setIsSubmitting(false);
      showToast({
        success: resp.success,
        message: resp.message,
      });



    }
  };

  if (verifying) {
    return (
      <Card className="max-w-md border-primary mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-2xl text-primary font-bold">Verify Email</h1>
          <p className="text-secondary">Check your inbox for the code</p>
        </CardHeader>
        <div className="border-primary border-b" />
        <CardContent>
          {verificationError && (
            <div className="p-3 bg-destructive/10 text-destructive mb-4 rounded-2xl font-bold flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{verificationError}</span>
            </div>
          )}
          <form onSubmit={verify} className="space-y-4">
            <Label htmlFor="code" className="font-bold">Verification Code</Label>
            <Input className="border-primary text-primary" id="code" value={code} onChange={e => setCode(e.target.value)} autoFocus />
            <Button type="submit" className="w-full cursor-pointer">{isSubmitting ? "Verifying..." : "Verify"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Didn't get it?{" "}
            <button
              className="text-brand-accent underline"
              onClick={async () => await signUp?.prepareEmailAddressVerification({ strategy: "email_code" })}
            >
              Resend
            </button>

          </p>
          <Button
            className="mt-3  bg-primary rounded-xl w-full cursor-pointer border-secondary text-primary text-sm px-3 py-2"
            onClick={() => setVerifying(false)}
          >
            Go back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md border-primary shadow-xl bg-secondary text-white mx-auto">
      <CardHeader className="text-center">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-secondary">Secure image management starts here</p>
      </CardHeader>
      <div className="border-primary border-t" />
      <CardContent>
        {authError && (
          <div className="p-3 bg-destructive/10 rounded-4xl mb-5 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[var(--error)] font-bold ">{authError}</span>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">FullName</Label>
            <Input
              className="border-primary text-secondary my-3"
              id="fullName"
              type="fullName"
              placeholder="Rahul Kumar"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-[var(--error)] font-medium tracking-wide">{form.formState.errors.fullName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Username</Label>
            <Input
              className="border-primary text-secondary my-3"
              id="username"
              type="username"
              placeholder="rkkk"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-[var(--error)] font-medium tracking-wide">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              className="border-primary text-secondary my-3"
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[var(--error)] font-medium tracking-wide">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                className="border-primary text-secondary my-3"
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                {...form.register("password")}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-muted-foreground"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-[var(--error)] font-medium tracking-wide">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <div className="relative">
              <Input
                className="border-primary text-secondary my-3"
                id="passwordConfirmation"
                type={showConfirmPwd ? "text" : "password"}
                placeholder="••••••••"
                {...form.register("passwordConfirmation")}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-muted-foreground"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {form.formState.errors.passwordConfirmation && (
              <p className="text-sm text-[var(--error)] font-medium tracking-wide">
                {form.formState.errors.passwordConfirmation.message}
              </p>
            )}
          </div>
          <div>
            <div id="clerk-captcha" />

          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-brand-accent" />
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our Terms & Privacy
            </p>
          </div>

          <Button type="submit" className="w-full cursor-pointer">{isSubmitting ? "Creating..." : "Create Account"}</Button>
        </form>
      </CardContent>
      <div className="border-primary border-t" />
      <CardFooter className="text-center">
        <p className="text-sm text-secondary font-bold">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-brand-accent underline">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}