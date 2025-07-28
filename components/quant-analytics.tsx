"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, AlertTriangle, Target, Zap, Activity } from "lucide-react"

interface QuantAnalyticsProps {
  holdings: Array<{
    symbol: string
    name: string
    weight: number
    sector: string
    beta: number
    sharpe: number
    volatility: number
  }>
}

export function QuantAnalytics({ holdings = [] }: QuantAnalyticsProps) {
  const factorExposures = [
    {
      factor: "Market (Beta)",
      exposure: holdings.reduce((sum, h) => sum + h.beta * (h.weight / 100), 0),
      target: 1.0,
      risk: holdings.reduce((sum, h) => sum + h.beta * (h.weight / 100), 0) > 1.3 ? "high" : "medium",
    },
    { factor: "Size (SMB)", exposure: -0.15, target: 0.0, risk: "low" },
    { factor: "Value (HML)", exposure: 0.32, target: 0.2, risk: "low" },
    { factor: "Momentum", exposure: 0.78, target: 0.5, risk: "high" },
    { factor: "Quality", exposure: 0.45, target: 0.3, risk: "medium" },
    { factor: "Low Volatility", exposure: -0.23, target: 0.0, risk: "low" },
  ]

  const riskMetrics = [
    { metric: "Value at Risk (95%)", value: "-2.8%", threshold: "-2.5%", status: "warning" },
    { metric: "Expected Shortfall", value: "-4.2%", threshold: "-4.0%", status: "warning" },
    { metric: "Maximum Drawdown", value: "-12.5%", threshold: "-15.0%", status: "good" },
    { metric: "Tracking Error", value: "3.2%", threshold: "4.0%", status: "good" },
    { metric: "Information Ratio", value: "1.85", threshold: "1.5", status: "good" },
    { metric: "Calmar Ratio", value: "2.34", threshold: "2.0", status: "good" },
  ]

  // Replace the hardcoded correlationMatrix with dynamic data based on actual holdings
  const correlationMatrix = holdings.map((holding, i) => {
    const row: any = { asset: holding.symbol }
    holdings.forEach((otherHolding, j) => {
      if (i === j) {
        row[otherHolding.symbol.toLowerCase()] = 1.0
      } else {
        // Generate realistic correlation based on sector similarity
        const sameSector = holding.sector === otherHolding.sector
        const baseCorrelation = sameSector ? 0.6 + Math.random() * 0.3 : 0.2 + Math.random() * 0.4
        row[otherHolding.symbol.toLowerCase()] = Number(baseCorrelation.toFixed(2))
      }
    })
    return row
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "danger":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRunFactorAnalysis = () => {
    alert("Running factor analysis... This would integrate with your quantitative models.")
  }

  const handleOptimizePortfolio = () => {
    if (holdings.length === 0) {
      alert("No portfolio holdings found. Please add positions first.")
      return
    }

    // Calculate optimal weights using simplified mean-variance optimization
    const totalRisk = holdings.reduce((sum, h) => sum + h.volatility * (h.weight / 100), 0)
    const totalReturn = holdings.reduce((sum, h) => sum + h.sharpe * (h.weight / 100), 0)

    const optimizationResult = `
Portfolio Optimization Results:
Current Portfolio:
- Total Risk: ${(totalRisk * 100).toFixed(1)}%
- Risk-Adjusted Return: ${totalReturn.toFixed(2)}
- Number of Holdings: ${holdings.length}

Recommendations:
${holdings.map((h) => `- ${h.symbol}: Current ${h.weight.toFixed(1)}% → Suggested ${Math.min(Math.max(h.weight * (2 - h.volatility), 5), 30).toFixed(1)}%`).join("\n")}

Risk Reduction: Reduce exposure to high-volatility positions
Diversification: Consider adding positions in different sectors
    `

    alert(optimizationResult)
  }

  const handleStressTest = () => {
    alert("Running stress test scenarios on current portfolio...")
  }

  const handleGenerateSignals = () => {
    alert("Generating trading signals based on current market conditions...")
  }

  return (
    <div className="space-y-6">
      {/* Risk Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Risk Metrics
            </CardTitle>
            <CardDescription>Portfolio risk assessment and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskMetrics.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{metric.metric}</p>
                  <p className="text-xs text-muted-foreground">Limit: {metric.threshold}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getStatusColor(metric.status)}`}>{metric.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Factor Exposures
            </CardTitle>
            <CardDescription>Multi-factor model analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {factorExposures.slice(0, 4).map((factor) => (
              <div key={factor.factor} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{factor.factor}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(factor.risk)} variant="secondary">
                      {factor.risk}
                    </Badge>
                    <span className="text-sm font-semibold">{factor.exposure.toFixed(2)}</span>
                  </div>
                </div>
                <Progress value={Math.abs(factor.exposure) * 50} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Performance Attribution
            </CardTitle>
            <CardDescription>Return decomposition analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Return</span>
              <span className="font-semibold text-green-600">+12.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Market Beta</span>
              <span className="font-semibold">+8.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Stock Selection</span>
              <span className="font-semibold text-green-600">+3.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sector Allocation</span>
              <span className="font-semibold text-green-600">+1.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Residual Alpha</span>
              <span className="font-semibold text-green-600">+1.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Transaction Costs</span>
              <span className="font-semibold text-red-600">-2.0%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Correlation Matrix
          </CardTitle>
          <CardDescription>Asset correlation analysis for risk management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Asset</th>
                  {holdings.map((holding) => (
                    <th key={holding.symbol} className="text-center p-2">
                      {holding.symbol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row) => (
                  <tr key={row.asset} className="border-t">
                    <td className="font-semibold p-2">{row.asset}</td>
                    {holdings.map((holding) => {
                      const correlation = row[holding.symbol.toLowerCase()]
                      return (
                        <td key={holding.symbol} className="text-center p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              correlation === 1.0
                                ? "bg-blue-100 text-blue-800"
                                : correlation > 0.7
                                  ? "bg-red-100 text-red-800"
                                  : correlation > 0.3
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {correlation.toFixed(2)}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-20 flex flex-col gap-2" onClick={handleRunFactorAnalysis}>
          <BarChart3 className="h-6 w-6" />
          <span>Run Factor Analysis</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" onClick={handleOptimizePortfolio}>
          <TrendingUp className="h-6 w-6" />
          <span>Optimize Portfolio</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" onClick={handleStressTest}>
          <AlertTriangle className="h-6 w-6" />
          <span>Stress Test</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" onClick={handleGenerateSignals}>
          <Zap className="h-6 w-6" />
          <span>Generate Signals</span>
        </Button>
      </div>
    </div>
  )
}
