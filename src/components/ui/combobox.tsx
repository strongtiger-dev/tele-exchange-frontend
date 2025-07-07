import { useEffect, useState } from "react"
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

  const iconMap: Record<string, () => Promise<any>> = {
    BTC: () => import('cryptocurrency-icons/svg/color/btc.svg'),
    ETH: () => import('cryptocurrency-icons/svg/color/eth.svg'),
    USDT: () => import('cryptocurrency-icons/svg/color/usdt.svg'),
    SOL: () => import('cryptocurrency-icons/svg/color/sol.svg'),
    XRP: () => import('cryptocurrency-icons/svg/color/xrp.svg'),
    USDC: () => import('cryptocurrency-icons/svg/color/usdc.svg'),
    LTC: () => import('cryptocurrency-icons/svg/color/ltc.svg'),
    BNB: () => import('cryptocurrency-icons/svg/color/bnb.svg'),
    ADA: () => import('cryptocurrency-icons/svg/color/ada.svg'),
  };

  function CoinIcon({ symbol }: { symbol: string }) {
    const [iconSrc, setIconSrc] = useState<string | null>(null);
  
    useEffect(() => {
      const loader = iconMap[symbol];
      if (loader) {
        loader().then((mod) => setIconSrc(mod.default));
      }
    }, [symbol]);
  
    if (!iconSrc) return null; // Or loading spinner
  
    return <img src={iconSrc} alt={symbol} width={24} height={24} />;
  }

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
                <CoinIcon symbol = {token.label.split(" ")[0]}/>
                {token.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
