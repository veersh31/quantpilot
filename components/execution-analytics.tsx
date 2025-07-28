"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, Zap, Target } from "lucide-react"

const executionMetrics = [
  {
    order: "ORD-001",
    symbol: "AAPL",
    side: "BUY",
    quantity: 1000,
    avgPrice: 184.52,
    vwap: 184.48,
    twap: 184.55,
    implementation: -0.04,
    marketImpact: 0.02,
    timing: -0.01,
    slippage: 0.03,
    status: "FILLED",
  },
  {
    order: "ORD-002",
    symbol: "NVDA",
    side: "SELL",
    quantity: 500,
    avgPrice: 735.28,
    vwap: 735.15,
    twap: 735.32,
    implementation: 0.13,
    marketImpact: -0.08,
    timing: 0.04,
    slippage: -0.04,
    status: "FILLED",
  },
  {
    order: "ORD-003",
    symbol: "TSLA",
    side: "BUY",
    quantity: 800,
    avgPrice: 245.67,
    vwap: 245.72,
    twap: 245.58,
    implementation: -0.05,
    marketImpact: 0.09,
    timing: -0.14,
    slippage: 0.09,
    status: "PARTIAL",
  },
]

const microstructureData = [
  { time: "09:30", bidAskSpread: 0.02, depth: 15000, toxicity: 0.15, adverseSelection: 0.08 },
  { time: "10:00", bidAskSpread: 0.01, depth: 22000, toxicity: 0.12, adverseSelection: 0.06 },
  { time: "11:00", bidAskSpread: 0.015, depth: 18000, toxicity: 0.18, adverseSelection: 0.09 },
  { time: "14:00", bidAskSpread: 0.012, depth: 25000, toxicity: 0.1, adverseSelection: 0.05 },
  { time: "15:30", bidAskSpread: 0.025, depth: 12000, toxicity: 0.25, adverseSelection: 0.12 },
]

export function ExecutionAnalytics() {
  return (
    <div className="space-y-6">
      {/* Execution Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Implementation Shortfall</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">-2.3 bps</p>
            <p className="text-sm text-muted-foreground">vs TWAP benchmark</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Market Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1.8 bps</p>
            <p className="text-sm text-muted-foreground">Average per trade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fill Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">94.2%</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Execution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">127ms</p>
            <p className="text-sm text-muted-foreground">Order to fill</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Execution Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Trade Execution Analysis
          </CardTitle>
          <CardDescription>Implementation shortfall decomposition by order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-center p-4 font-semibold">Symbol</th>
                  <th className="text-center p-4 font-semibold">Side</th>
                  <th className="text-center p-4 font-semibold">Quantity</th>
                  <th className="text-center p-4 font-semibold">Avg Price</th>
                  <th className="text-center p-4 font-semibold">VWAP</th>
                  <th className="text-center p-4 font-semibold">Implementation</th>
                  <th className="text-center p-4 font-semibold">Market Impact</th>
                  <th className="text-center p-4 font-semibold">Timing</th>
                  <th className="text-center p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {executionMetrics.map((trade) => (
                  <tr key={trade.order} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="font-mono p-4">{trade.order}</td>
                    <td className="text-center font-semibold p-4">{trade.symbol}</td>
                    <td className="text-center p-4">
                      <Badge
                        className={trade.side === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {trade.side}
                      </Badge>
                    </td>
                    <td className="text-center font-mono p-4">{trade.quantity.toLocaleString()}</td>
                    <td className="text-center font-mono p-4">${trade.avgPrice.toFixed(2)}</td>
                    <td className="text-center font-mono p-4">${trade.vwap.toFixed(2)}</td>
                    <td
                      className={`text-center font-mono p-4 font-semibold ${
                        trade.implementation > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trade.implementation > 0 ? "+" : ""}
                      {trade.implementation.toFixed(2)} bps
                    </td>
                    <td className="text-center font-mono p-4">{trade.marketImpact.toFixed(2)} bps</td>
                    <td
                      className={`text-center font-mono p-4 font-semibold ${trade.timing > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {trade.timing > 0 ? "+" : ""}
                      {trade.timing.toFixed(2)} bps
                    </td>
                    <td className="text-center p-4">
                      <Badge
                        className={
                          trade.status === "FILLED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Market Microstructure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Market Microstructure Analytics
          </CardTitle>
          <CardDescription>Intraday liquidity and market quality metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time</th>
                  <th className="text-center p-2">Bid-Ask Spread</th>
                  <th className="text-center p-2">Market Depth</th>
                  <th className="text-center p-2">Order Flow Toxicity</th>
                  <th className="text-center p-2">Adverse Selection</th>
                  <th className="text-center p-2">Liquidity Score</th>
                </tr>
              </thead>
              <tbody>
                {microstructureData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="font-mono p-2">{data.time}</td>
                    <td className="text-center font-mono p-2">${data.bidAskSpread.toFixed(3)}</td>
                    <td className="text-center font-mono p-2">{data.depth.toLocaleString()}</td>
                    <td className="text-center p-2">
                      <div className="flex items-center gap-2">
                        <Progress value={data.toxicity * 100} className="h-2 w-16" />
                        <span className="font-mono text-xs">{(data.toxicity * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="text-center font-mono p-2">{(data.adverseSelection * 100).toFixed(1)}%</td>
                    <td className="text-center p-2">
                      <Badge
                        className={
                          data.toxicity < 0.15
                            ? "bg-green-100 text-green-800"
                            : data.toxicity < 0.2
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {data.toxicity < 0.15 ? "HIGH" : data.toxicity < 0.2 ? "MED" : "LOW"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Execution Algorithms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Algorithm Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>TWAP Algorithm</span>
              <div className="text-right">
                <p className="font-semibold text-green-600">-1.2 bps</p>
                <p className="text-xs text-muted-foreground">vs benchmark</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>VWAP Algorithm</span>
              <div className="text-right">
                <p className="font-semibold text-green-600">-0.8 bps</p>
                <p className="text-xs text-muted-foreground">vs benchmark</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Implementation Shortfall</span>
              <div className="text-right">
                <p className="font-semibold text-green-600">-2.1 bps</p>
                <p className="text-xs text-muted-foreground">vs benchmark</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>POV (20%)</span>
              <div className="text-right">
                <p className="font-semibold text-red-600">+0.5 bps</p>
                <p className="text-xs text-muted-foreground">vs benchmark</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timing Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Pre-Market (4:00-9:30)</span>
              <div className="text-right">
                <p className="font-semibold">-0.3 bps</p>
                <p className="text-xs text-muted-foreground">avg impact</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Market Open (9:30-10:00)</span>
              <div className="text-right">
                <p className="font-semibold text-red-600">+2.1 bps</p>
                <p className="text-xs text-muted-foreground">avg impact</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Mid-Day (10:00-15:00)</span>
              <div className="text-right">
                <p className="font-semibold text-green-600">-0.8 bps</p>
                <p className="text-xs text-muted-foreground">avg impact</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Market Close (15:00-16:00)</span>
              <div className="text-right">
                <p className="font-semibold text-red-600">+1.5 bps</p>
                <p className="text-xs text-muted-foreground">avg impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
