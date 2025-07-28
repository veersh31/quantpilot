"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Zap, Play, Settings, TrendingUp, Activity, Target } from "lucide-react"

interface AlgoStrategy {
  id: string
  name: string
  type: string
  status: "running" | "paused" | "stopped"
  pnl: number
  pnlPercent: number
  sharpe: number
  maxDrawdown: number
  winRate: number
  trades: number
  allocation: number
  lastSignal: string
  signalTime: string
}

const strategies: AlgoStrategy[] = [
  {
    id: "momentum_rsi",
    name: "Momentum RSI",
    type: "Momentum",
    status: "running",
    pnl: 45230,
    pnlPercent: 12.4,
    sharpe: 1.85,
    maxDrawdown: -8.2,
    winRate: 67,
    trades: 156,
    allocation: 25,
    lastSignal: "BUY AAPL",
    signalTime: "2 min ago",
  },
  {
    id: "mean_reversion",
    name: "Mean Reversion",
    type: "Mean Reversion",
    status: "running",
    pnl: 28750,
    pnlPercent: 8.9,
    sharpe: 1.42,
    maxDrawdown: -5.7,
    winRate: 58,
    trades: 203,
    allocation: 20,
    lastSignal: "SELL TSLA",
    signalTime: "15 min ago",
  },
  {
    id: "pairs_trading",
    name: "Pairs Trading",
    type: "Statistical Arbitrage",
    status: "paused",
    pnl: 15680,
    pnlPercent: 5.2,
    sharpe: 2.12,
    maxDrawdown: -3.1,
    winRate: 72,
    trades: 89,
    allocation: 15,
    lastSignal: "LONG AAPL/SHORT MSFT",
    signalTime: "1 hour ago",
  },
  {
    id: "ml_momentum",
    name: "ML Momentum",
    type: "Machine Learning",
    status: "running",
    pnl: 62340,
    pnlPercent: 18.7,
    sharpe: 2.34,
    maxDrawdown: -6.8,
    winRate: 74,
    trades: 124,
    allocation: 30,
    lastSignal: "BUY NVDA",
    signalTime: "5 min ago",
  },
  {
    id: "volatility_arb",
    name: "Volatility Arbitrage",
    type: "Options",
    status: "stopped",
    pnl: -3420,
    pnlPercent: -1.2,
    sharpe: 0.85,
    maxDrawdown: -12.4,
    winRate: 45,
    trades: 67,
    allocation: 10,
    lastSignal: "SELL VIX CALL",
    signalTime: "2 hours ago",
  },
]

export function AlgoStrategies() {
  const [strategyStates, setStrategyStates] = useState(strategies)

  const toggleStrategy = (id: string) => {
    setStrategyStates((prev) =>
      prev.map((strategy) =>
        strategy.id === id ? { ...strategy, status: strategy.status === "running" ? "paused" : "running" } : strategy,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "stopped":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Momentum":
        return "bg-blue-100 text-blue-800"
      case "Mean Reversion":
        return "bg-purple-100 text-purple-800"
      case "Statistical Arbitrage":
        return "bg-orange-100 text-orange-800"
      case "Machine Learning":
        return "bg-pink-100 text-pink-800"
      case "Options":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPnL = strategyStates.reduce((sum, strategy) => sum + strategy.pnl, 0)
  const totalAllocation = strategyStates.reduce((sum, strategy) => sum + strategy.allocation, 0)
  const runningStrategies = strategyStates.filter((s) => s.status === "running").length

  const handleDeployStrategy = () => {
    alert("Opening strategy deployment wizard...")
  }

  const handlePerformanceReport = () => {
    alert("Generating comprehensive performance report for all strategies...")
  }

  const handleStrategySettings = () => {
    alert("Opening strategy configuration panel...")
  }

  const handleOptimizeAllocation = () => {
    alert("Optimizing capital allocation across all active strategies...")
  }

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalPnL > 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalPnL.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Across all strategies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{runningStrategies}</p>
            <p className="text-sm text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAllocation}%</p>
            <p className="text-sm text-muted-foreground">Portfolio allocated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">ML Momentum</p>
            <p className="text-sm text-green-600">+18.7% return</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Algorithmic Strategies
          </CardTitle>
          <CardDescription>Monitor and manage your automated trading strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategyStates.map((strategy) => (
              <div key={strategy.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{strategy.name}</h3>
                    <Badge className={getTypeColor(strategy.type)}>{strategy.type}</Badge>
                    <Badge className={getStatusColor(strategy.status)}>{strategy.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={strategy.status === "running"}
                      onCheckedChange={() => toggleStrategy(strategy.id)}
                    />
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">P&L</p>
                    <p className={`font-semibold ${strategy.pnl > 0 ? "text-green-600" : "text-red-600"}`}>
                      ${strategy.pnl.toLocaleString()}
                    </p>
                    <p className={`text-xs ${strategy.pnlPercent > 0 ? "text-green-600" : "text-red-600"}`}>
                      {strategy.pnlPercent > 0 ? "+" : ""}
                      {strategy.pnlPercent}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Sharpe</p>
                    <p className="font-semibold">{strategy.sharpe}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Max DD</p>
                    <p className="font-semibold text-red-600">{strategy.maxDrawdown}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="font-semibold">{strategy.winRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Trades</p>
                    <p className="font-semibold">{strategy.trades}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Allocation</p>
                    <p className="font-semibold">{strategy.allocation}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Last Signal:</span>
                    <span className="text-sm">{strategy.lastSignal}</span>
                    <span className="text-xs text-muted-foreground">({strategy.signalTime})</span>
                  </div>
                  <div className="w-32">
                    <Progress value={strategy.allocation} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-20 flex flex-col gap-2" onClick={handleDeployStrategy}>
          <Play className="h-6 w-6" />
          <span>Deploy New Strategy</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" onClick={handlePerformanceReport}>
          <Activity className="h-6 w-6" />
          <span>Performance Report</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" onClick={handleStrategySettings}>
          <Settings className="h-6 w-6" />
          <span>Strategy Settings</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-transparent"
          onClick={handleOptimizeAllocation}
        >
          <TrendingUp className="h-6 w-6" />
          <span>Optimize Allocation</span>
        </Button>
      </div>
    </div>
  )
}
