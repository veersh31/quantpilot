"use client"

import { useState, useCallback } from "react"

export interface QuantHolding {
  symbol: string
  name: string
  shares: number
  purchasePrice: number
  currentPrice: number
  value: number
  weight: number
  pnl: number
  pnlPercent: number
  beta: number
  sharpe: number
  volatility: number
  sector: string
}

export interface RiskAlert {
  id: string
  type: "risk_breach" | "concentration" | "correlation" | "volatility"
  message: string
  severity: "high" | "medium" | "low"
  time: string
  threshold?: number
  current?: number
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<QuantHolding[]>([])
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])

  const recalculateWeights = useCallback((updatedHoldings: QuantHolding[]) => {
    const total = updatedHoldings.reduce((sum, holding) => sum + holding.value, 0)
    return updatedHoldings.map((holding) => ({
      ...holding,
      weight: total > 0 ? (holding.value / total) * 100 : 0,
    }))
  }, [])

  const calculateMetrics = useCallback((shares: number, purchasePrice: number, currentPrice: number) => {
    const value = shares * currentPrice
    const pnl = shares * (currentPrice - purchasePrice)
    const pnlPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100
    return { value, pnl, pnlPercent }
  }, [])

  const generateRiskAlerts = useCallback((portfolioHoldings: QuantHolding[]) => {
    const alerts: RiskAlert[] = []
    const now = new Date()

    if (portfolioHoldings.length === 0) return alerts

    // Calculate portfolio metrics
    const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.value, 0)
    const portfolioVaR = portfolioHoldings.reduce((sum, h) => sum + h.volatility * (h.weight / 100), 0) * 2.33 // 95% VaR approximation

    // VaR breach alert
    if (portfolioVaR > 0.025) {
      // 2.5% threshold
      alerts.push({
        id: `var_breach_${Date.now()}`,
        type: "risk_breach",
        message: `Portfolio VaR exceeded limit: ${(portfolioVaR * 100).toFixed(1)}% vs 2.5% limit`,
        severity: "high",
        time: `${Math.floor(Math.random() * 30) + 1} minutes ago`,
        threshold: 2.5,
        current: portfolioVaR * 100,
      })
    }

    // Concentration alerts
    portfolioHoldings.forEach((holding) => {
      if (holding.weight > 18) {
        alerts.push({
          id: `concentration_${holding.symbol}_${Date.now()}`,
          type: "concentration",
          message: `${holding.symbol} position approaching 20% limit (${holding.weight.toFixed(1)}%)`,
          severity: holding.weight > 19 ? "high" : "medium",
          time: `${Math.floor(Math.random() * 60) + 5} minutes ago`,
          threshold: 20,
          current: holding.weight,
        })
      }
    })

    // High volatility alerts
    portfolioHoldings.forEach((holding) => {
      if (holding.volatility > 0.4) {
        alerts.push({
          id: `volatility_${holding.symbol}_${Date.now()}`,
          type: "volatility",
          message: `${holding.symbol} volatility elevated: ${(holding.volatility * 100).toFixed(1)}%`,
          severity: holding.volatility > 0.5 ? "high" : "medium",
          time: `${Math.floor(Math.random() * 120) + 10} minutes ago`,
          threshold: 40,
          current: holding.volatility * 100,
        })
      }
    })

    // Sector correlation alert
    const techHoldings = portfolioHoldings.filter((h) => h.sector === "Technology")
    const techWeight = techHoldings.reduce((sum, h) => sum + h.weight, 0)
    if (techWeight > 60) {
      alerts.push({
        id: `correlation_tech_${Date.now()}`,
        type: "correlation",
        message: `Tech sector concentration high: ${techWeight.toFixed(1)}%`,
        severity: techWeight > 70 ? "high" : "medium",
        time: `${Math.floor(Math.random() * 90) + 15} minutes ago`,
        threshold: 60,
        current: techWeight,
      })
    }

    return alerts
  }, [])

  const addHolding = useCallback(
    (newHolding: Omit<QuantHolding, "value" | "weight" | "pnl" | "pnlPercent">) => {
      const currentPrice = newHolding.purchasePrice * (1 + (Math.random() * 0.4 - 0.2)) // Simulate ±20% price movement
      const { value, pnl, pnlPercent } = calculateMetrics(newHolding.shares, newHolding.purchasePrice, currentPrice)

      const completeHolding: QuantHolding = {
        ...newHolding,
        currentPrice,
        value,
        weight: 0, // Will be recalculated
        pnl,
        pnlPercent,
      }

      setHoldings((prev) => {
        const updated = recalculateWeights([...prev, completeHolding])
        setRiskAlerts(generateRiskAlerts(updated))
        return updated
      })
    },
    [calculateMetrics, recalculateWeights, generateRiskAlerts],
  )

  const removeHolding = useCallback(
    (symbol: string) => {
      setHoldings((prev) => {
        const updated = recalculateWeights(prev.filter((h) => h.symbol !== symbol))
        setRiskAlerts(generateRiskAlerts(updated))
        return updated
      })
    },
    [recalculateWeights, generateRiskAlerts],
  )

  const updateHolding = useCallback(
    (symbol: string, updates: Partial<QuantHolding>) => {
      setHoldings((prev) => {
        const updated = prev.map((h) => {
          if (h.symbol === symbol) {
            const updatedHolding = { ...h, ...updates }
            if (updates.shares !== undefined || updates.purchasePrice !== undefined) {
              const { value, pnl, pnlPercent } = calculateMetrics(
                updatedHolding.shares,
                updatedHolding.purchasePrice,
                updatedHolding.currentPrice,
              )
              return { ...updatedHolding, value, pnl, pnlPercent }
            }
            return updatedHolding
          }
          return h
        })
        const recalculated = recalculateWeights(updated)
        setRiskAlerts(generateRiskAlerts(recalculated))
        return recalculated
      })
    },
    [calculateMetrics, recalculateWeights, generateRiskAlerts],
  )

  const dismissAlert = useCallback((alertId: string) => {
    setRiskAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }, [])

  return {
    holdings,
    riskAlerts,
    addHolding,
    removeHolding,
    updateHolding,
    dismissAlert,
  }
}
