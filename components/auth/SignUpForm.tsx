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
import { Separator } from "@/components/ui/separator";
import { saveUserToDB } from "@/lib/actions/saveUser";
import { showToast } from "../main/Toast";

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
const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", passwordConfirmation: "", username: "", fullName: "" ,avatar: "",githubUrl: ""},
  });

  const onSubmit = async (data: typeof form["formState"]["defaultValues"]) => {
    if (!isLoaded || !data) return;
    setIsSubmitting(true); setAuthError(null);
    try {
      await signUp.create({
      emailAddress: data.email,
      password: data.password,
    });
    
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
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
        await setActive({ session: res.createdSessionId });
         resp = await saveUserToDB({
          fullName: form.getValues("fullName"),
          email: form.getValues("email"),
          username: form.getValues("username"),
          password: form.getValues("password"),
          avatar: "",
          githubUrl: "",
        });
        router.push("/");
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
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Verify Email</h1>
          <p className="text-muted-foreground">Check your inbox for the code</p>
        </CardHeader>
        <Separator />
        <CardContent>
          {verificationError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{verificationError}</span>
            </div>
          )}
          <form onSubmit={verify} className="space-y-4">
            <Label htmlFor="code">Verification Code</Label>
            <Input id="code" value={code} onChange={e => setCode(e.target.value)} autoFocus />
            <Button type="submit" className="w-full">{isSubmitting ? "Verifying..." : "Verify"}</Button>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground">Secure image management starts here</p>
      </CardHeader>
      <Separator />
      <CardContent>
        {authError && (
          <div className="p-3 bg-destructive/10 text-destructive rounded flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{authError}</span>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
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
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <div className="relative">
              <Input
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
              <p className="text-sm text-destructive">
                {form.formState.errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-brand-accent" />
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our Terms & Privacy
            </p>
          </div>

          <Button type="submit" className="w-full">{isSubmitting ? "Creating..." : "Create Account"}</Button>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-brand-accent underline">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}