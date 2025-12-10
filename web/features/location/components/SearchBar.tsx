'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FilterStatus } from '../api/locationApi'

interface SearchBarProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  onSearch: () => void
  filterStatus: FilterStatus
  onFilterStatusChange: (status: FilterStatus) => void
}

export function SearchBar({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  filterStatus,
  onFilterStatusChange,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, student ID, or company..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyUp={handleKeyPress}
          />
        </div>
        <Button onClick={onSearch} className="px-6">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      <div className="flex gap-2">
        <select
          className="px-4 py-2 border rounded-lg bg-background"
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value as FilterStatus)}
        >
          <option value="ALL">All Statuses</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
        </select>
      </div>
    </div>
  )
}

