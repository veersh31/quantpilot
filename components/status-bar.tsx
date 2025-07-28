"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, Wifi, Database, Clock } from "lucide-react"

interface StatusBarProps {
  marketStatus: {
    status: string
    reason: string
  }
}

export function StatusBar({ marketStatus }: StatusBarProps) {
  const getMarketStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "text-green-500"
      case "PRE-MARKET":
      case "AFTER-HOURS":
        return "text-yellow-500"
      case "CLOSED":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-6 bg-background border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-green-500" />
          <span>Live Data</span>
        </div>
        <Separator orientation="vertical" className="h-3" />
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          <span>Memory: 847 items</span>
        </div>
        <Separator orientation="vertical" className="h-3" />
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Clock className={`h-3 w-3 ${getMarketStatusColor(marketStatus.status)}`} />
          <span>Market: {marketStatus.status}</span>
        </div>
        <Separator orientation="vertical" className="h-3" />
        <Badge variant="outline" className="h-4 text-xs">
          ⌘K for commands
        </Badge>
      </div>
    </div>
  )
}
