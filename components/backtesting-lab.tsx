"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Play, BarChart3, TrendingUp, AlertCircle, Code, Settings } from "lucide-react"

const backtestResults = [
  {
    strategy: "Momentum RSI",
    period: "2020-2024",
    totalReturn: "156.7%",
    annualReturn: "26.2%",
    sharpe: "1.85",
    maxDrawdown: "-12.3%",
    winRate: "67%",
    status: "completed",
  },
  {
    strategy: "Mean Reversion",
    period: "2020-2024",
    totalReturn: "89.4%",
    annualReturn: "17.3%",
    sharpe: "1.42",
    maxDrawdown: "-8.7%",
    winRate: "58%",
    status: "completed",
  },
  {
    strategy: "Pairs Trading",
    period: "2020-2024",
    totalReturn: "67.2%",
    annualReturn: "13.8%",
    sharpe: "2.12",
    maxDrawdown: "-5.4%",
    winRate: "72%",
    status: "running",
  },
]

export function BacktestingLab() {
  const [selectedStrategy, setSelectedStrategy] = useState("")
  const [strategyCode, setStrategyCode] = useState(`# Momentum Strategy Example
import pandas as pd
import numpy as np

def momentum_strategy(data, lookback=20, threshold=0.02):
    """
    Simple momentum strategy based on price momentum
    """
    data['returns'] = data['close'].pct_change()
    data['momentum'] = data['returns'].rolling(lookback).mean()
    
    # Generate signals
    data['signal'] = np.where(data['momentum'] > threshold, 1, 
                     np.where(data['momentum'] < -threshold, -1, 0))
    
    return data

# Backtest parameters
START_DATE = '2020-01-01'
END_DATE = '2024-01-01'
INITIAL_CAPITAL = 100000
COMMISSION = 0.001`)

  return (
    <div className="space-y-6">
      {/* Strategy Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Strategy Builder
            </CardTitle>
            <CardDescription>Create and test your algorithmic trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategy-name">Strategy Name</Label>
                <Input id="strategy-name" placeholder="My Momentum Strategy" />
              </div>
              <div>
                <Label htmlFor="strategy-type">Strategy Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="pairs-trading">Pairs Trading</SelectItem>
                    <SelectItem value="arbitrage">Statistical Arbitrage</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" defaultValue="2020-01-01" />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" defaultValue="2024-01-01" />
              </div>
              <div>
                <Label htmlFor="capital">Initial Capital</Label>
                <Input id="capital" placeholder="100000" />
              </div>
            </div>

            <div>
              <Label htmlFor="universe">Universe</Label>
              <Input id="universe" placeholder="SPY, QQQ, AAPL, MSFT, NVDA" />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Run Backtest
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategy Code</CardTitle>
            <CardDescription>Write your strategy logic in Python</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={strategyCode}
              onChange={(e) => setStrategyCode(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Write your strategy code here..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Backtest Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Backtest Results
          </CardTitle>
          <CardDescription>Historical performance of your strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backtestResults.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{result.strategy}</h3>
                    <Badge variant={result.status === "completed" ? "default" : "secondary"}>{result.status}</Badge>
                    <span className="text-sm text-muted-foreground">{result.period}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total Return</p>
                    <p className="font-semibold text-green-600">{result.totalReturn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Annual Return</p>
                    <p className="font-semibold">{result.annualReturn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                    <p className="font-semibold">{result.sharpe}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Max Drawdown</p>
                    <p className="font-semibold text-red-600">{result.maxDrawdown}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="font-semibold">{result.winRate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex justify-center">
                      {result.status === "completed" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Best Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Momentum RSI</p>
            <p className="text-sm text-green-600">+156.7% total return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Highest Sharpe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2.12</p>
            <p className="text-sm text-muted-foreground">Pairs Trading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Lowest Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-5.4%</p>
            <p className="text-sm text-muted-foreground">Pairs Trading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Backtests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-sm text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
