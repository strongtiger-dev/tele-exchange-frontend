import { useState } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type Token = {
  label: string
  value: string
  icon: string
}

interface TokenSelectProps {
  tokens: Token[]
  value: string
  onChange: (val: string) => void
  className?: string
}

export function TokenSelect({
  tokens,
  value,
  onChange,
  className,
}: TokenSelectProps) {
  const [open, setOpen] = useState(false)
  const selected = tokens.find((t) => t.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[120px] h-9 px-3 py-1 rounded-md !bg-gray-700 !text-white text-sm flex items-center justify-between",
            "hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-ring/50",
            className
          )}
        >
          {selected ? selected.label : "Select"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent  className="z-50 w-[120px] p-0 bg-gray-700 text-white border border-white shadow-md rounded-md">
        <Command className = "bg-gray-800 text-white">
          <CommandInput  placeholder="Search token..." />
          <CommandEmpty className = "bg-gray-800 text-white" >No token found.</CommandEmpty>
          <CommandGroup className = "bg-gray-800 text-white max-h-48 overflow-y-auto" >
            {tokens.map((token) => (
              <CommandItem
                className="hover:!bg-gray-700 !bg-gray-800 !text-white"
                key={token.value}
                value={token.value}
                onSelect={() => {
                  onChange(token.value)
                  setOpen(false)
                }}
              >
                {/* <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === token.value ? "opacity-100" : "opacity-0"
                  )}
                /> */}
                <img src={token.icon} alt={token.label} className="w-6 h-6 mr-2" />
                {token.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
