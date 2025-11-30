"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface ChallengeFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  search: string
  type: string
  difficulty: string
  status: string
}

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "external", label: "External Platform" },
  { value: "file", label: "File Upload" },
  { value: "github", label: "GitHub" },
]

const difficultyOptions = [
  { value: "all", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ended", label: "Ended" },
]

export function ChallengeFilters({ onFilterChange }: ChallengeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    difficulty: "all",
    status: "all",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      search: "",
      type: "all",
      difficulty: "all",
      status: "all",
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters =
    filters.search || filters.type !== "all" || filters.difficulty !== "all" || filters.status !== "all"

  return (
    <div className="space-y-4">
      {/* Search & Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.type} onValueChange={(v) => updateFilter("type", v)}>
            <SelectTrigger className="w-[140px] bg-secondary border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.difficulty} onValueChange={(v) => updateFilter("difficulty", v)}>
            <SelectTrigger className="w-[130px] bg-secondary border-border">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(v) => updateFilter("status", v)}>
            <SelectTrigger className="w-[120px] bg-secondary border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filters:
          </span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("search", "")} />
            </Badge>
          )}
          {filters.type !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {typeOptions.find((o) => o.value === filters.type)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("type", "all")} />
            </Badge>
          )}
          {filters.difficulty !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {difficultyOptions.find((o) => o.value === filters.difficulty)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("difficulty", "all")} />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {statusOptions.find((o) => o.value === filters.status)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("status", "all")} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
