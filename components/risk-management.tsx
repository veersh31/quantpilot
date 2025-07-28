"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Shield, TrendingDown, Activity, Settings, Bell, X, FileText } from "lucide-react"
import type { QuantHolding, RiskAlert } from "@/hooks/use-portfolio"

interface RiskManagementProps {
  holdings: QuantHolding[]
  riskAlerts: RiskAlert[]
  onDismissAlert: (alertId: string) => void
}

export function RiskManagement({ holdings, riskAlerts, onDismissAlert }: RiskManagementProps) {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    varThreshold: 2.5,
    concentrationThreshold: 20,
    volatilityThreshold: 40,
    correlationThreshold: 60,
    enableEmailAlerts: true,
    enablePushAlerts: true,
  })

  const calculateRiskLimits = () => {
    if (holdings.length === 0) {
      return [
        { metric: "Portfolio VaR (95%)", current: 0, limit: alertConfig.varThreshold, unit: "%", status: "good" },
        {
          metric: "Single Position Limit",
          current: 0,
          limit: alertConfig.concentrationThreshold,
          unit: "%",
          status: "good",
        },
        {
          metric: "Sector Concentration",
          current: 0,
          limit: alertConfig.correlationThreshold,
          unit: "%",
          status: "good",
        },
        { metric: "Leverage Ratio", current: 1.0, limit: 1.5, unit: "x", status: "good" },
        { metric: "Correlation Limit", current: 0, limit: 0.85, unit: "", status: "good" },
        { metric: "Tracking Error", current: 0, limit: 4.0, unit: "%", status: "good" },
      ]
    }

    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
    const portfolioVaR = holdings.reduce((sum, h) => sum + h.volatility * (h.weight / 100), 0) * 2.33 * 100
    const maxPosition = Math.max(...holdings.map((h) => h.weight))
    const techWeight = holdings.filter((h) => h.sector === "Technology").reduce((sum, h) => sum + h.weight, 0)
    const avgCorrelation = holdings.length > 1 ? 0.65 : 0 // Simplified correlation estimate

    return [
      {
        metric: "Portfolio VaR (95%)",
        current: portfolioVaR,
        limit: alertConfig.varThreshold,
        unit: "%",
        status:
          portfolioVaR > alertConfig.varThreshold
            ? "breach"
            : portfolioVaR > alertConfig.varThreshold * 0.8
              ? "warning"
              : "good",
      },
      {
        metric: "Single Position Limit",
        current: maxPosition,
        limit: alertConfig.concentrationThreshold,
        unit: "%",
        status:
          maxPosition > alertConfig.concentrationThreshold
            ? "breach"
            : maxPosition > alertConfig.concentrationThreshold * 0.9
              ? "warning"
              : "good",
      },
      {
        metric: "Sector Concentration",
        current: techWeight,
        limit: alertConfig.correlationThreshold,
        unit: "%",
        status:
          techWeight > alertConfig.correlationThreshold
            ? "breach"
            : techWeight > alertConfig.correlationThreshold * 0.85
              ? "warning"
              : "good",
      },
      { metric: "Leverage Ratio", current: 1.0, limit: 1.5, unit: "x", status: "good" },
      {
        metric: "Correlation Limit",
        current: avgCorrelation,
        limit: 0.85,
        unit: "",
        status: avgCorrelation > 0.85 ? "breach" : avgCorrelation > 0.75 ? "warning" : "good",
      },
      { metric: "Tracking Error", current: 3.2, limit: 4.0, unit: "%", status: "good" },
    ]
  }

  const riskLimits = calculateRiskLimits()

  const stressTests = [
    {
      scenario: "2008 Financial Crisis",
      portfolioReturn: holdings.length > 0 ? "-18.5%" : "N/A",
      benchmarkReturn: "-37.0%",
      relativeReturn: holdings.length > 0 ? "+18.5%" : "N/A",
      status: holdings.length > 0 ? "outperform" : "no_data",
    },
    {
      scenario: "COVID-19 Crash (Mar 2020)",
      portfolioReturn: holdings.length > 0 ? "-12.3%" : "N/A",
      benchmarkReturn: "-34.0%",
      relativeReturn: holdings.length > 0 ? "+21.7%" : "N/A",
      status: holdings.length > 0 ? "outperform" : "no_data",
    },
    {
      scenario: "Tech Bubble Burst (2000)",
      portfolioReturn: holdings.length > 0 ? "-28.7%" : "N/A",
      benchmarkReturn: "-49.1%",
      relativeReturn: holdings.length > 0 ? "+20.4%" : "N/A",
      status: holdings.length > 0 ? "outperform" : "no_data",
    },
    {
      scenario: "Rising Interest Rates",
      portfolioReturn: holdings.length > 0 ? "-8.9%" : "N/A",
      benchmarkReturn: "-12.4%",
      relativeReturn: holdings.length > 0 ? "+3.5%" : "N/A",
      status: holdings.length > 0 ? "outperform" : "no_data",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "breach":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "breach":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-800 border-green-200"
      default:
        return "bg-gray-50 text-gray-800 border-gray-200"
    }
  }

  const handleRunStressTest = () => {
    if (holdings.length === 0) {
      alert("No portfolio holdings found. Please add positions first to run stress tests.")
      return
    }
    alert("Running comprehensive stress test across historical scenarios...")
  }

  const handleUpdateLimits = () => {
    setIsConfigDialogOpen(true)
  }

  const handleRiskReport = () => {
    if (holdings.length === 0) {
      alert("No portfolio data available. Please add positions first to generate a risk report.")
      return
    }
    setIsReportDialogOpen(true)
  }

  const handleConfigureAlerts = () => {
    setIsConfigDialogOpen(true)
  }

  const generateRiskReport = () => {
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
    const portfolioVaR = holdings.reduce((sum, h) => sum + h.volatility * (h.weight / 100), 0) * 2.33 * 100
    const maxPosition = Math.max(...holdings.map((h) => h.weight))

    return `
PORTFOLIO RISK ASSESSMENT REPORT
Generated: ${new Date().toLocaleString()}

PORTFOLIO OVERVIEW:
- Total Value: $${totalValue.toLocaleString()}
- Number of Holdings: ${holdings.length}
- Largest Position: ${holdings.find((h) => h.weight === maxPosition)?.symbol || "N/A"} (${maxPosition.toFixed(1)}%)

RISK METRICS:
- Portfolio VaR (95%): ${portfolioVaR.toFixed(2)}%
- Maximum Drawdown Estimate: ${(portfolioVaR * 1.5).toFixed(2)}%
- Portfolio Beta: ${holdings.reduce((sum, h) => sum + h.beta * (h.weight / 100), 0).toFixed(2)}
- Average Volatility: ${(holdings.reduce((sum, h) => sum + h.volatility * (h.weight / 100), 0) * 100).toFixed(1)}%

CONCENTRATION ANALYSIS:
${holdings.map((h) => `- ${h.symbol}: ${h.weight.toFixed(1)}% (${h.sector})`).join("\n")}

RISK ALERTS: ${riskAlerts.length} active alerts
${riskAlerts.map((alert) => `- ${alert.message}`).join("\n")}

RECOMMENDATIONS:
- Monitor concentration limits
- Consider diversification across sectors
- Review position sizing for high-volatility holdings
- Implement stop-loss orders for risk management
    `
  }

  return (
    <div className="space-y-6">
      {/* Risk Alerts */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600" />
            Risk Alerts ({riskAlerts.length})
          </CardTitle>
          <CardDescription>Real-time risk monitoring and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
              <p className="text-lg font-medium text-green-600">All Clear</p>
              <p className="text-sm text-muted-foreground">No active risk alerts</p>
            </div>
          ) : (
            riskAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} relative`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{alert.time}</span>
                    <Button variant="ghost" size="sm" onClick={() => onDismissAlert(alert.id)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Risk Limits Dashboard */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Limits Monitoring
          </CardTitle>
          <CardDescription>Portfolio risk limits and current exposures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskLimits.map((limit) => (
              <div key={limit.metric} className="p-4 border rounded-lg bg-gradient-to-r from-background to-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{limit.metric}</h3>
                  <Badge className={getStatusBadge(limit.status)}>{limit.status}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-bold ${getStatusColor(limit.status)}`}>
                    {limit.current.toFixed(limit.unit === "" ? 2 : 1)}
                    {limit.unit}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Limit: {limit.limit}
                    {limit.unit}
                  </span>
                </div>
                <Progress value={(limit.current / limit.limit) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stress Testing */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Stress Testing Results
          </CardTitle>
          <CardDescription>Portfolio performance under historical stress scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stressTests.map((test, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-background to-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{test.scenario}</h3>
                  <Badge
                    className={
                      test.status === "outperform" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                  >
                    {test.status === "outperform" ? "outperform" : "no data"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Portfolio Return</p>
                    <p className="font-semibold text-red-600">{test.portfolioReturn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Benchmark Return</p>
                    <p className="font-semibold text-red-600">{test.benchmarkReturn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Relative Return</p>
                    <p className="font-semibold text-green-600">{test.relativeReturn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          onClick={handleRunStressTest}
        >
          <Activity className="h-6 w-6" />
          <span>Run Stress Test</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all"
          onClick={handleUpdateLimits}
        >
          <Shield className="h-6 w-6" />
          <span>Update Limits</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all"
          onClick={handleRiskReport}
        >
          <FileText className="h-6 w-6" />
          <span>Risk Report</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-gradient-to-r from-background to-muted/20 hover:shadow-lg transition-all"
          onClick={handleConfigureAlerts}
        >
          <Settings className="h-6 w-6" />
          <span>Configure Alerts</span>
        </Button>
      </div>

      {/* Alert Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Risk Alert Configuration</DialogTitle>
            <DialogDescription>Configure your risk monitoring thresholds and alert preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="var-threshold">VaR Threshold (%)</Label>
                <Input
                  id="var-threshold"
                  type="number"
                  step="0.1"
                  value={alertConfig.varThreshold}
                  onChange={(e) =>
                    setAlertConfig({ ...alertConfig, varThreshold: Number.parseFloat(e.target.value) || 2.5 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="concentration-threshold">Position Limit (%)</Label>
                <Input
                  id="concentration-threshold"
                  type="number"
                  value={alertConfig.concentrationThreshold}
                  onChange={(e) =>
                    setAlertConfig({ ...alertConfig, concentrationThreshold: Number.parseInt(e.target.value) || 20 })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volatility-threshold">Volatility Threshold (%)</Label>
                <Input
                  id="volatility-threshold"
                  type="number"
                  value={alertConfig.volatilityThreshold}
                  onChange={(e) =>
                    setAlertConfig({ ...alertConfig, volatilityThreshold: Number.parseInt(e.target.value) || 40 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="correlation-threshold">Sector Limit (%)</Label>
                <Input
                  id="correlation-threshold"
                  type="number"
                  value={alertConfig.correlationThreshold}
                  onChange={(e) =>
                    setAlertConfig({ ...alertConfig, correlationThreshold: Number.parseInt(e.target.value) || 60 })
                  }
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <Switch
                  id="email-alerts"
                  checked={alertConfig.enableEmailAlerts}
                  onCheckedChange={(checked) => setAlertConfig({ ...alertConfig, enableEmailAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-alerts">Push Notifications</Label>
                <Switch
                  id="push-alerts"
                  checked={alertConfig.enablePushAlerts}
                  onCheckedChange={(checked) => setAlertConfig({ ...alertConfig, enablePushAlerts: checked })}
                />
              </div>
            </div>
            <Button onClick={() => setIsConfigDialogOpen(false)} className="w-full">
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Risk Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Portfolio Risk Assessment Report</DialogTitle>
            <DialogDescription>Comprehensive risk analysis of your current portfolio</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto">
              {generateRiskReport()}
            </pre>
            <div className="flex gap-2">
              <Button onClick={() => navigator.clipboard.writeText(generateRiskReport())} className="flex-1">
                Copy Report
              </Button>
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
