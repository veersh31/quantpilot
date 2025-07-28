"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, Percent, Plus, Trash2, BarChart3, Edit } from "lucide-react"
import type { QuantHolding } from "@/hooks/use-portfolio"

interface QuantPortfolioProps {
  holdings: QuantHolding[]
  onAddHolding: (holding: Omit<QuantHolding, "value" | "weight" | "pnl" | "pnlPercent">) => void
  onRemoveHolding: (symbol: string) => void
  onUpdateHolding: (symbol: string, updates: Partial<QuantHolding>) => void
}

export function QuantPortfolio({ holdings, onAddHolding, onRemoveHolding, onUpdateHolding }: QuantPortfolioProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState<QuantHolding | null>(null)
  const [newStock, setNewStock] = useState({
    symbol: "",
    name: "",
    shares: "",
    purchasePrice: "",
    sector: "Technology",
  })

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)
  const totalCost = holdings.reduce((sum, holding) => sum + holding.shares * holding.purchasePrice, 0)
  const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0)
  const totalPnLPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0

  const portfolioBeta =
    holdings.length > 0 ? holdings.reduce((sum, holding) => sum + holding.beta * (holding.weight / 100), 0) : 0
  const portfolioSharpe =
    holdings.length > 0 ? holdings.reduce((sum, holding) => sum + holding.sharpe * (holding.weight / 100), 0) : 0

  const handleAddStock = () => {
    if (!newStock.symbol || !newStock.name || !newStock.shares || !newStock.purchasePrice) return

    const shares = Number.parseInt(newStock.shares)
    const purchasePrice = Number.parseFloat(newStock.purchasePrice)

    const newHolding = {
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name,
      shares,
      purchasePrice,
      currentPrice: purchasePrice, // Will be updated with simulated price
      beta: 0.8 + Math.random() * 1.0, // Random beta 0.8-1.8
      sharpe: 1.0 + Math.random() * 1.5, // Random sharpe 1.0-2.5
      volatility: 0.15 + Math.random() * 0.4, // Random volatility 15%-55%
      sector: newStock.sector,
    }

    onAddHolding(newHolding)
    setNewStock({ symbol: "", name: "", shares: "", purchasePrice: "", sector: "Technology" })
    setIsAddDialogOpen(false)
  }

  const handleEditStock = (holding: QuantHolding) => {
    setEditingHolding(holding)
    setIsEditDialogOpen(true)
  }

  const handleUpdateStock = () => {
    if (!editingHolding) return

    onUpdateHolding(editingHolding.symbol, {
      name: editingHolding.name,
      shares: editingHolding.shares,
      purchasePrice: editingHolding.purchasePrice,
      sector: editingHolding.sector,
    })

    setIsEditDialogOpen(false)
    setEditingHolding(null)
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current market value</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPnL > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL > 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPnL > 0 ? "+" : ""}${totalPnL.toLocaleString()}
            </div>
            <p className={`text-xs ${totalPnLPercent > 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPnLPercent > 0 ? "+" : ""}
              {totalPnLPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Beta</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioBeta.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">vs S&P 500</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioSharpe.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Detail */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Current positions with P&L and risk metrics</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  <Plus className="h-4 w-4" />
                  Add Position
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Position</DialogTitle>
                  <DialogDescription>Add a new stock position based on your purchase price</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="symbol">Symbol</Label>
                      <Input
                        id="symbol"
                        placeholder="AAPL"
                        value={newStock.symbol}
                        onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sector">Sector</Label>
                      <Select
                        value={newStock.sector}
                        onValueChange={(value) => setNewStock({ ...newStock, sector: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Financial">Financial</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Consumer Discretionary">Consumer Discretionary</SelectItem>
                          <SelectItem value="Consumer Staples">Consumer Staples</SelectItem>
                          <SelectItem value="Energy">Energy</SelectItem>
                          <SelectItem value="Industrials">Industrials</SelectItem>
                          <SelectItem value="Materials">Materials</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      placeholder="Apple Inc."
                      value={newStock.name}
                      onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shares">Shares</Label>
                      <Input
                        id="shares"
                        type="number"
                        placeholder="100"
                        value={newStock.shares}
                        onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchasePrice">Purchase Price</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        value={newStock.purchasePrice}
                        onChange={(e) => setNewStock({ ...newStock, purchasePrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddStock} className="w-full">
                    Add Position
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No positions yet</p>
                <p className="text-sm">Add your first stock position to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {holdings.map((holding) => (
                <div
                  key={holding.symbol}
                  className="p-4 border rounded-lg bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{holding.symbol}</h3>
                          <Badge variant="outline" className="text-xs">
                            {holding.sector}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{holding.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {holding.shares} shares @ ${holding.purchasePrice.toFixed(2)} → $
                          {holding.currentPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">${holding.value.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{holding.weight.toFixed(1)}%</p>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className={`font-semibold ${holding.pnl > 0 ? "text-green-600" : "text-red-600"}`}>
                          {holding.pnl > 0 ? "+" : ""}${holding.pnl.toLocaleString()}
                        </p>
                        <p className={`text-xs ${holding.pnlPercent > 0 ? "text-green-600" : "text-red-600"}`}>
                          {holding.pnlPercent > 0 ? "+" : ""}
                          {holding.pnlPercent.toFixed(2)}%
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditStock(holding)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveHolding(holding.symbol)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Metrics Row */}
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Beta</p>
                      <p className="font-semibold">{holding.beta.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Sharpe</p>
                      <p className="font-semibold">{holding.sharpe.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Volatility</p>
                      <p className="font-semibold">{(holding.volatility * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Cost Basis</p>
                      <p className="font-semibold">${(holding.shares * holding.purchasePrice).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Stock Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Stock Position</DialogTitle>
            <DialogDescription>Update your stock position details</DialogDescription>
          </DialogHeader>
          {editingHolding && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-symbol">Stock Symbol</Label>
                <Input id="edit-symbol" value={editingHolding.symbol} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="edit-name">Company Name</Label>
                <Input
                  id="edit-name"
                  value={editingHolding.name}
                  onChange={(e) => setEditingHolding({ ...editingHolding, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-sector">Sector</Label>
                <Select
                  value={editingHolding.sector}
                  onValueChange={(value) => setEditingHolding({ ...editingHolding, sector: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Consumer Discretionary">Consumer Discretionary</SelectItem>
                    <SelectItem value="Consumer Staples">Consumer Staples</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Industrials">Industrials</SelectItem>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-shares">Number of Shares</Label>
                  <Input
                    id="edit-shares"
                    type="number"
                    value={editingHolding.shares}
                    onChange={(e) =>
                      setEditingHolding({ ...editingHolding, shares: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-purchasePrice">Purchase Price</Label>
                  <Input
                    id="edit-purchasePrice"
                    type="number"
                    step="0.01"
                    value={editingHolding.purchasePrice}
                    onChange={(e) =>
                      setEditingHolding({ ...editingHolding, purchasePrice: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateStock} className="flex-1">
                  Update Position
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
