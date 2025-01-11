"use client"

import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { ComponentPropsWithoutRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/utils/supabase/client"
import { redirects } from "@/lib/config/redirects"
import { useToast } from "@repo/ui/hooks/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@repo/ui/components/form"
import { Loader2 } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui/components/input-otp"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be 6 digits long",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
})

export interface VerifyOTPFormProps extends ComponentPropsWithoutRef<"div"> {
  email: string;
}

export function VerifyOTPForm({
  className,
  email,
  ...props
}: VerifyOTPFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email,
    },
  })

  useEffect(() => {
    const lastResend = localStorage.getItem('lastResendTime');
    if (lastResend) {
      const timeLeft = 30 - Math.floor((Date.now() - parseInt(lastResend)) / 1000);
      if (timeLeft > 0) {
        setCooldown(timeLeft);
      }
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const sb = createClient();

    const { error } = await sb.auth.verifyOtp({
      token: values.otp,
      type: "email",
      email: values.email,
    })

    if (error) {
      console.error(error);
      setIsLoading(false);
      toast({
        title: "Uh oh!",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Done!",
        description: "You've been logged in.",
      });

      router.push(redirects.auth.afterLogin);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;

    setIsResending(true);
    const sb = createClient();

    const { error } = await sb.auth.signInWithOtp({
      email,
    });

    if (error) {
      console.error(error);
      toast({
        title: "Uh oh!",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } else {
      localStorage.setItem('lastResendTime', Date.now().toString());
      setCooldown(30);
      toast({
        title: "OTP Resent",
        description: "We've sent you a new OTP code.",
      });
    }
    setIsResending(false);
  }

  return (
    <Card className={cn("flex flex-col gap-6", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Log In</CardTitle>
        <CardDescription>
          Enter the OTP sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6" >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3 mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Verify
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isResending || cooldown > 0}
                  onClick={handleResend}
                >
                  {isResending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Resend OTP
                  {cooldown > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({cooldown}s)
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
