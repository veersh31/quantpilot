"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Brain } from "lucide-react"

const factorLoadings = [
  { factor: "Market", loading: 1.24, tstat: 8.45, pvalue: 0.001, rsquared: 0.68 },
  { factor: "SMB", loading: -0.15, tstat: -2.12, pvalue: 0.034, rsquared: 0.04 },
  { factor: "HML", loading: 0.32, tstat: 3.78, pvalue: 0.002, rsquared: 0.12 },
  { factor: "RMW", loading: 0.28, tstat: 2.95, pvalue: 0.003, rsquared: 0.08 },
  { factor: "CMA", loading: -0.18, tstat: -1.89, pvalue: 0.059, rsquared: 0.03 },
]

const optionsGreeks = [
  { symbol: "AAPL", strike: 180, expiry: "2024-03-15", delta: 0.65, gamma: 0.012, theta: -0.08, vega: 0.25, iv: 0.28 },
  { symbol: "NVDA", strike: 800, expiry: "2024-03-15", delta: 0.42, gamma: 0.008, theta: -0.12, vega: 0.35, iv: 0.45 },
  { symbol: "TSLA", strike: 250, expiry: "2024-03-15", delta: -0.35, gamma: 0.015, theta: 0.06, vega: -0.18, iv: 0.58 },
]

const performanceAttribution = [
  { factor: "Asset Selection", contribution: 3.2, tstat: 2.85, significance: "**" },
  { factor: "Sector Allocation", contribution: 1.8, tstat: 1.95, significance: "*" },
  { factor: "Market Timing", contribution: -0.5, tstat: -0.45, significance: "" },
  { factor: "Currency", contribution: 0.3, tstat: 0.28, significance: "" },
  { factor: "Residual Alpha", contribution: 2.1, tstat: 3.12, significance: "***" },
]

export function AdvancedAnalytics() {
  const [selectedModel, setSelectedModel] = useState("fama-french-5")
  const [lookbackPeriod, setLookbackPeriod] = useState("252")
  const [confidenceLevel, setConfidenceLevel] = useState("95")

  return (
    <div className="space-y-6">
      {/* Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Factor Model Configuration
          </CardTitle>
          <CardDescription>Configure your quantitative models and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">
                Factor Model
              </Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="capm">CAPM</SelectItem>
                  <SelectItem value="fama-french-3">Fama-French 3-Factor</SelectItem>
                  <SelectItem value="fama-french-5">Fama-French 5-Factor</SelectItem>
                  <SelectItem value="carhart-4">Carhart 4-Factor</SelectItem>
                  <SelectItem value="barra">Barra Risk Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lookback" className="text-sm font-medium">
                Lookback Period
              </Label>
              <Select value={lookbackPeriod} onValueChange={setLookbackPeriod}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="63">3 Months (63 days)</SelectItem>
                  <SelectItem value="126">6 Months (126 days)</SelectItem>
                  <SelectItem value="252">1 Year (252 days)</SelectItem>
                  <SelectItem value="504">2 Years (504 days)</SelectItem>
                  <SelectItem value="1260">5 Years (1260 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence" className="text-sm font-medium">
                Confidence Level
              </Label>
              <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90% Confidence</SelectItem>
                  <SelectItem value="95">95% Confidence</SelectItem>
                  <SelectItem value="99">99% Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full h-10">
                <Brain className="h-4 w-4 mr-2" />
                Run Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="factor-analysis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="factor-analysis">Factor Analysis</TabsTrigger>
          <TabsTrigger value="options-analytics">Options Analytics</TabsTrigger>
          <TabsTrigger value="performance-attribution">Attribution</TabsTrigger>
          <TabsTrigger value="regime-detection">Regime Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="factor-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Factor Loadings & Statistical Significance</CardTitle>
              <CardDescription>
                {selectedModel.toUpperCase()} model results with t-statistics and p-values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Factor</th>
                      <th className="text-center p-2">Loading (β)</th>
                      <th className="text-center p-2">t-statistic</th>
                      <th className="text-center p-2">p-value</th>
                      <th className="text-center p-2">R²</th>
                      <th className="text-center p-2">Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factorLoadings.map((factor) => (
                      <tr key={factor.factor} className="border-b">
                        <td className="font-semibold p-2">{factor.factor}</td>
                        <td className="text-center p-2 font-mono">{factor.loading.toFixed(3)}</td>
                        <td className="text-center p-2 font-mono">{factor.tstat.toFixed(2)}</td>
                        <td className="text-center p-2 font-mono">{factor.pvalue.toFixed(3)}</td>
                        <td className="text-center p-2 font-mono">{factor.rsquared.toFixed(3)}</td>
                        <td className="text-center p-2">
                          {factor.pvalue < 0.001 ? (
                            <Badge className="bg-green-100 text-green-800">***</Badge>
                          ) : factor.pvalue < 0.01 ? (
                            <Badge className="bg-blue-100 text-blue-800">**</Badge>
                          ) : factor.pvalue < 0.05 ? (
                            <Badge className="bg-yellow-100 text-yellow-800">*</Badge>
                          ) : (
                            <Badge variant="outline">NS</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>*** p&lt;0.001, ** p&lt;0.01, * p&lt;0.05, NS = Not Significant</p>
                <p>Adjusted R² = 0.742, F-statistic = 45.67 (p&lt;0.001)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options-analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Options Greeks & Implied Volatility</CardTitle>
              <CardDescription>Real-time options analytics for portfolio positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-center p-2">Strike</th>
                      <th className="text-center p-2">Expiry</th>
                      <th className="text-center p-2">Delta (Δ)</th>
                      <th className="text-center p-2">Gamma (Γ)</th>
                      <th className="text-center p-2">Theta (Θ)</th>
                      <th className="text-center p-2">Vega (ν)</th>
                      <th className="text-center p-2">IV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionsGreeks.map((option, index) => (
                      <tr key={index} className="border-b">
                        <td className="font-semibold p-2">{option.symbol}</td>
                        <td className="text-center p-2">${option.strike}</td>
                        <td className="text-center p-2">{option.expiry}</td>
                        <td className="text-center p-2 font-mono">{option.delta.toFixed(3)}</td>
                        <td className="text-center p-2 font-mono">{option.gamma.toFixed(3)}</td>
                        <td className="text-center p-2 font-mono">{option.theta.toFixed(3)}</td>
                        <td className="text-center p-2 font-mono">{option.vega.toFixed(3)}</td>
                        <td className="text-center p-2 font-mono">{(option.iv * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-sm text-muted-foreground">Portfolio Delta</p>
                  <p className="text-lg font-bold">0.72</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-sm text-muted-foreground">Portfolio Gamma</p>
                  <p className="text-lg font-bold">0.035</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-sm text-muted-foreground">Portfolio Theta</p>
                  <p className="text-lg font-bold text-red-600">-0.14</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-sm text-muted-foreground">Portfolio Vega</p>
                  <p className="text-lg font-bold">0.42</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance-attribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brinson-Fachler Performance Attribution</CardTitle>
              <CardDescription>Decomposition of portfolio returns vs benchmark</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Attribution Factor</th>
                      <th className="text-center p-2">Contribution (%)</th>
                      <th className="text-center p-2">t-statistic</th>
                      <th className="text-center p-2">Significance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceAttribution.map((attr) => (
                      <tr key={attr.factor} className="border-b">
                        <td className="font-semibold p-2">{attr.factor}</td>
                        <td
                          className={`text-center p-2 font-mono font-semibold ${
                            attr.contribution > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {attr.contribution > 0 ? "+" : ""}
                          {attr.contribution.toFixed(2)}%
                        </td>
                        <td className="text-center p-2 font-mono">{attr.tstat.toFixed(2)}</td>
                        <td className="text-center p-2">
                          {attr.significance === "***" ? (
                            <Badge className="bg-green-100 text-green-800">***</Badge>
                          ) : attr.significance === "**" ? (
                            <Badge className="bg-blue-100 text-blue-800">**</Badge>
                          ) : attr.significance === "*" ? (
                            <Badge className="bg-yellow-100 text-yellow-800">*</Badge>
                          ) : (
                            <Badge variant="outline">NS</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Active Return:</span>
                  <span className="font-bold text-green-600 text-lg">+6.9%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Information Ratio:</span>
                  <span className="font-semibold">1.85</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regime-detection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Regime Detection</CardTitle>
              <CardDescription>Hidden Markov Model for market state identification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
                  <h3 className="font-semibold text-green-800">Bull Market</h3>
                  <p className="text-2xl font-bold text-green-600">72%</p>
                  <p className="text-sm text-muted-foreground">Probability</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h3 className="font-semibold text-yellow-800">Sideways Market</h3>
                  <p className="text-2xl font-bold text-yellow-600">23%</p>
                  <p className="text-sm text-muted-foreground">Probability</p>
                </div>
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
                  <h3 className="font-semibold text-red-800">Bear Market</h3>
                  <p className="text-2xl font-bold text-red-600">5%</p>
                  <p className="text-sm text-muted-foreground">Probability</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Regime Characteristics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Expected Return (Bull):</span>
                      <span className="font-mono ml-2">+12.4% p.a.</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volatility (Bull):</span>
                      <span className="font-mono ml-2">18.2%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Return (Bear):</span>
                      <span className="font-mono ml-2">-8.7% p.a.</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volatility (Bear):</span>
                      <span className="font-mono ml-2">28.5%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm">
                    <strong>Model Signal:</strong> Current regime suggests maintaining risk-on positioning with moderate
                    leverage. Expected regime persistence: 15-20 trading days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
