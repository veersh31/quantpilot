"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, DollarSign, Percent, AlertCircle, Plus, Trash2, Edit } from "lucide-react"

interface Holding {
  symbol: string
  name: string
  value: number
  weight: number
  change: number
  news: number
  shares?: number
  avgPrice?: number
}

const initialHoldings: Holding[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    value: 485000,
    weight: 19.8,
    change: 2.3,
    news: 2,
    shares: 1000,
    avgPrice: 485,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    value: 367500,
    weight: 15.0,
    change: -1.2,
    news: 5,
    shares: 500,
    avgPrice: 735,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    value: 294000,
    weight: 12.0,
    change: 1.8,
    news: 1,
    shares: 800,
    avgPrice: 367.5,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    value: 245000,
    weight: 10.0,
    change: 0.9,
    news: 3,
    shares: 1750,
    avgPrice: 140,
  },
  { symbol: "TSLA", name: "Tesla Inc.", value: 196000, weight: 8.0, change: -3.1, news: 7, shares: 800, avgPrice: 245 },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    value: 171500,
    weight: 7.0,
    change: 1.4,
    news: 2,
    shares: 1100,
    avgPrice: 155.9,
  },
]

export function PortfolioOverview() {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [newStock, setNewStock] = useState({
    symbol: "",
    name: "",
    shares: "",
    avgPrice: "",
  })

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0)
  const dayChange = holdings.reduce((sum, holding) => sum + (holding.value * holding.change) / 100, 0)
  const dayChangePercent = (dayChange / totalValue) * 100

  const recalculateWeights = (updatedHoldings: Holding[]) => {
    const total = updatedHoldings.reduce((sum, holding) => sum + holding.value, 0)
    return updatedHoldings.map((holding) => ({
      ...holding,
      weight: total > 0 ? (holding.value / total) * 100 : 0,
    }))
  }

  const handleAddStock = () => {
    if (!newStock.symbol || !newStock.name || !newStock.shares || !newStock.avgPrice) return

    const shares = Number.parseInt(newStock.shares)
    const avgPrice = Number.parseFloat(newStock.avgPrice)
    const value = shares * avgPrice

    const newHolding: Holding = {
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name,
      value,
      weight: 0, // Will be recalculated
      change: Math.random() * 6 - 3, // Random change for demo
      news: Math.floor(Math.random() * 5),
      shares,
      avgPrice,
    }

    const updatedHoldings = recalculateWeights([...holdings, newHolding])
    setHoldings(updatedHoldings)
    setNewStock({ symbol: "", name: "", shares: "", avgPrice: "" })
    setIsAddDialogOpen(false)
  }

  const handleRemoveStock = (symbol: string) => {
    const updatedHoldings = recalculateWeights(holdings.filter((h) => h.symbol !== symbol))
    setHoldings(updatedHoldings)
  }

  const handleEditStock = (holding: Holding) => {
    setEditingHolding(holding)
    setIsEditDialogOpen(true)
  }

  const handleUpdateStock = () => {
    if (!editingHolding) return

    const updatedHoldings = holdings.map((h) =>
      h.symbol === editingHolding.symbol
        ? {
            ...editingHolding,
            value: (editingHolding.shares || 0) * (editingHolding.avgPrice || 0),
          }
        : h,
    )

    setHoldings(recalculateWeights(updatedHoldings))
    setIsEditDialogOpen(false)
    setEditingHolding(null)
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day Change</CardTitle>
            {dayChange > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dayChange > 0 ? "text-green-600" : "text-red-600"}`}>
              ${dayChange.toLocaleString()}
            </div>
            <p className={`text-xs ${dayChangePercent > 0 ? "text-green-600" : "text-red-600"}`}>
              {dayChangePercent > 0 ? "+" : ""}
              {dayChangePercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holdings</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.reduce((sum, holding) => sum + holding.news, 0)}</div>
            <p className="text-xs text-muted-foreground">Unread items</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Current positions with real-time insights</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Stock</DialogTitle>
                  <DialogDescription>Add a new stock position to your portfolio</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symbol">Stock Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., AAPL"
                      value={newStock.symbol}
                      onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Apple Inc."
                      value={newStock.name}
                      onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shares">Number of Shares</Label>
                    <Input
                      id="shares"
                      type="number"
                      placeholder="e.g., 100"
                      value={newStock.shares}
                      onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgPrice">Average Price per Share</Label>
                    <Input
                      id="avgPrice"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 150.00"
                      value={newStock.avgPrice}
                      onChange={(e) => setNewStock({ ...newStock, avgPrice: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddStock} className="flex-1">
                      Add Stock
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div key={holding.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{holding.symbol}</h3>
                      {holding.news > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {holding.news} news
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{holding.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {holding.shares} shares @ ${holding.avgPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold">${holding.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{holding.weight.toFixed(1)}% of portfolio</p>
                  </div>

                  <div className="w-24">
                    <Progress value={holding.weight} className="h-2" />
                  </div>

                  <div className="text-right min-w-[60px]">
                    <p className={`font-semibold ${holding.change > 0 ? "text-green-600" : "text-red-600"}`}>
                      {holding.change > 0 ? "+" : ""}
                      {holding.change.toFixed(1)}%
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditStock(holding)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveStock(holding.symbol)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Stock Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
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
                <Label htmlFor="edit-avgPrice">Average Price per Share</Label>
                <Input
                  id="edit-avgPrice"
                  type="number"
                  step="0.01"
                  value={editingHolding.avgPrice}
                  onChange={(e) =>
                    setEditingHolding({ ...editingHolding, avgPrice: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateStock} className="flex-1">
                  Update Stock
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
