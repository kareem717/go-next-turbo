"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, useState } from "react";
import { createAccountAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import Link from "next/link";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zCreateAccountParams } from "@repo/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormMessage, FormControl, FormLabel, FormItem, FormField } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

export interface CreateAccountFormProps extends ComponentPropsWithoutRef<"div"> {
  defaultUsername?: string;
}

export function CreateAccountForm({
  className,
  defaultUsername = "",
  ...props
}: CreateAccountFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  // We want to keep the loading state through redirect on success
  // thus we can't use the isExecuting state from the action
  const [isExecuting, setIsExecuting] = useState(false)

  const { form, handleSubmitWithAction } =
    useHookFormAction(createAccountAction, zodResolver(zCreateAccountParams), {
      actionProps: {
        onExecute: () => {
          setIsExecuting(true)
        },
        onSuccess: () => {
          toast({
            title: "Account created",
            description: "Account created successfully. We are redirecting you to the app.",
          })

          form.reset()
          router.push(redirects.dashboard.index)
        },
        onError: ({ error }) => {
          toast({
            title: "Error",
            description: error.serverError?.message ?? "An error occurred",
            variant: "destructive",
          })

          setIsExecuting(false)
        }
      },
      formProps: {
        defaultValues: {
          username: defaultUsername,
        },
      },
    });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmitWithAction} className="grid gap-6" >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="fooBaz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isExecuting}>
                {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <Link href={redirects.legal.terms}>Terms of Service</Link>{" "}
        and <Link href={redirects.legal.privacy}>Privacy Policy</Link>.
      </div>
    </div>
  );
};
