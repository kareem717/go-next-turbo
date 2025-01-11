"use client";

import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form"
import { Input } from "@repo/ui/components/input"
import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";
import { createProjectAction } from "@/actions/project";
import { redirects } from "@/lib/config/redirects";
import { zCreateProjectParams } from "@repo/sdk/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useToast } from "@repo/ui/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function CreateProjectForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const { toast } = useToast()

  const { form, action: { isExecuting }, handleSubmitWithAction } =
    useHookFormAction(createProjectAction, zodResolver(zCreateProjectParams), {
      actionProps: {
        onSuccess: () => {
          form.reset()

          toast({
            title: "Done!",
            description: "Your business has been created.",
          })

          router.push(redirects.dashboard.index)
        },
        onError: ({ error }) => {
          toast({
            title: "Something went wrong",
            description: error.serverError?.message || "An unknown error occurred",
            variant: "destructive",
          })
        }
      },
      formProps: {
        defaultValues: {
          name: "",
        }
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className={cn("space-y-8 w-full max-w-2xl", className)} {...props}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isExecuting} className="w-full">
          {isExecuting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Project
        </Button>
      </form>
    </Form>
  )
}
