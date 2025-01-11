"use client"

import { useTheme } from "next-themes"
import { ComponentPropsWithoutRef } from "react"
import { Moon, Sun } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group"
import { cn } from "@repo/ui/lib/utils"

export function ModeToggle({ className, ...props }: Omit<ComponentPropsWithoutRef<typeof ToggleGroup>, "defaultValue" | "value" | "onValueChange" | "type">) {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ToggleGroup {...props} type="single" defaultValue={theme} onValueChange={toggleTheme} className={cn("w-full [&>*]:w-full", className)}>
      <ToggleGroupItem value="light"> 
        <Moon className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <Sun className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>

  )
}
