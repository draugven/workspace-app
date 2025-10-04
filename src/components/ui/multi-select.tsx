'use client'

import * as React from 'react'
import { Check, X, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface MultiSelectOption {
  label: string
  value: string
  color?: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  emptyText = 'No items found.',
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(selected.filter((item) => item !== value))
  }

  const selectedOptions = options.filter((option) =>
    selected.includes(option.value)
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            !selected.length && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 ? (
              placeholder
            ) : (
              <span className="text-sm">
                {selected.length} {selected.length === 1 ? 'item' : 'items'} selected
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] max-w-2xl p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-none">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                {options.map((option) => {
                  const isSelected = selected.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      keywords={[option.label]}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 shrink-0',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.color && (
                        <div
                          className="mr-2 h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              style={
                option.color
                  ? {
                      backgroundColor: `${option.color}20`,
                      borderColor: option.color,
                      color: option.color,
                    }
                  : undefined
              }
              className="gap-1"
            >
              {option.color && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
              )}
              {option.label}
              <button
                type="button"
                onClick={(e) => handleRemove(option.value, e)}
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </Popover>
  )
}
