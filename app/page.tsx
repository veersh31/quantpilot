"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Brain, BarChart3, AlertCircle, Command, Settings } from 'lucide-react'
import { ChatInterface } from "@/components/chat-interface"
import { QuantPortfolio } from "@/components/quant-portfolio"
import { QuantAnalytics } from "@/components/quant-analytics"
import { RiskManagement } from "@/components/risk-management"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandPalette } from "@/components/command-palette"
import { StatusBar } from "@/components/status-bar"
import { usePortfolio } from "@/hooks/use-portfolio"

function getMarketStatus() {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 6 = Saturday
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hour * 60 + minutes

  // Weekend check
  if (day === 0 || day === 6) {
    return { status: "CLOSED", reason: "Weekend" }
  }

  // Market hours: 9:30 AM - 4:00 PM ET (converted to minutes)
  const marketOpen = 9 * 60 + 30 // 9:30 AM
  const marketClose = 16 * 60 // 4:00 PM

  if (currentTime >= marketOpen && currentTime < marketClose) {
    return { status: "OPEN", reason: "Regular Hours" }
  } else if (currentTime >= 4 * 60 && currentTime < marketOpen) {
    return { status: "PRE-MARKET", reason: "Pre-Market" }
  } else if (currentTime >= marketClose && currentTime < 20 * 60) {
    return { status: "AFTER-HOURS", reason: "After Hours" }
  } else {
    return { status: "CLOSED", reason: "Overnight" }
  }
}

export default function QuantResearchCopilot() {
  const [activeTab, setActiveTab] = useState("chat")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [marketStatus, setMarketStatus] = useState(getMarketStatus())

  const { holdings, riskAlerts, addHolding, removeHolding, updateHolding, dismissAlert } = usePortfolio()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      setMarketStatus(getMarketStatus())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            setActiveTab("chat")
            break
          case "2":
            e.preventDefault()
            setActiveTab("portfolio")
            break
          case "3":
            e.preventDefault()
            setActiveTab("analytics")
            break
          case "4":
            e.preventDefault()
            setActiveTab("risk")
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Convert holdings to analytics format
  const analyticsHoldings = holdings.map((h) => ({
    symbol: h.symbol,
    name: h.name,
    weight: h.weight,
    sector: h.sector,
    beta: h.beta,
    sharpe: h.sharpe,
    volatility: h.volatility,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-6">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  QuantPilot AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentTime.toLocaleTimeString()} • {marketStatus.status} ({marketStatus.reason})
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Badge
                  variant="secondary"
                  className="animate-pulse bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
                >
                  AI Portfolio Manager
                </Badge>
                <Badge variant="outline" className="border-blue-200">
                  Professional
                </Badge>
                <Badge variant="outline" className="border-purple-200">
                  Quantitative
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all"
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline">⌘K</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <p className="text-muted-foreground">
            AI-powered quantitative research platform with autonomous portfolio management capabilities
          </p>
        </div>

        {/* Main Interface - Streamlined to 4 Essential Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm">
            <TabsTrigger
              value="chat"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Research</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
              <span className="sm:hidden">Port</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
            <TabsTrigger
              value="risk"
              className="flex items-center gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Risk</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface 
              onAddHolding={addHolding} 
              onRemoveHolding={removeHolding} 
              holdings={holdings}
            />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <QuantPortfolio
              holdings={holdings}
              onAddHolding={addHolding}
              onRemoveHolding={removeHolding}
              onUpdateHolding={updateHolding}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <QuantAnalytics holdings={analyticsHoldings} />
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <RiskManagement holdings={holdings} riskAlerts={riskAlerts} onDismissAlert={dismissAlert} />
          </TabsContent>
        </Tabs>
      </div>

      <CommandPalette onNavigate={setActiveTab} />
      <StatusBar marketStatus={marketStatus} />
    </div>
  )
}
