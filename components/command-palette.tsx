"use client"

import * as React from "react"
import { Calculator, FileText, Search, Settings, TrendingUp, Zap } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface CommandPaletteProps {
  onNavigate: (tab: string) => void
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => onNavigate("chat"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Quant Chat</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate("portfolio"))}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Portfolio</span>
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate("analytics"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Analytics</span>
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate("strategies"))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Strategies</span>
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculate Sharpe Ratio</span>
          </CommandItem>
          <CommandItem>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Run Factor Analysis</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Generate Risk Report</span>
          </CommandItem>
          <CommandItem>
            <Zap className="mr-2 h-4 w-4" />
            <span>Optimize Portfolio</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
