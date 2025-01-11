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
import { Input } from "@repo/ui/components/input"
import { ComponentPropsWithoutRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/utils/supabase/client"
import { redirects } from "@/lib/config/redirects"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@repo/ui/components/form"
import { Loader2 } from "lucide-react"
import { OAuthButtons } from "./oauth-buttons"
import { useRouter } from "next/navigation"
import { useToast } from "@repo/ui/hooks/use-toast"
import Link from "next/link"
import { GithubIcon, GoogleIcon } from "@/components/icons"

const formSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    message: "Invalid email address.",
  }).email({
    message: "Invalid email address.",
  }).min(1, {
    message: "Email is required",
  }),
})

export function LoginForm({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const sb = createClient();

    const { error } = await sb.auth.signInWithOtp({
      email: values.email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });

      setIsLoading(false);
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a OTP to login.",
      });

      router.push(redirects.auth.otp(values.email));
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6" >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </Form>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <OAuthButtons providers={[{ provider: "google", icon: GoogleIcon }, { provider: "github", icon: GithubIcon }]} disabled={isLoading} />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
        and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}
