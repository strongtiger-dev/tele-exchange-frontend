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
import { Badge } from "@/components/ui/badge"

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
    TRC20: () => import('cryptocurrency-icons/svg/color/trx.svg'),
    ERC20: () => import('cryptocurrency-icons/svg/color/eth.svg'),
    ETH: () => import('cryptocurrency-icons/svg/color/eth.svg'),
    USDT: () => import('cryptocurrency-icons/svg/color/usdt.svg'),
    SOL: () => import('cryptocurrency-icons/svg/color/sol.svg'),
    XRP: () => import('cryptocurrency-icons/svg/color/xrp.svg'),
    USDC: () => import('cryptocurrency-icons/svg/color/usdc.svg'),
    LTC: () => import('cryptocurrency-icons/svg/color/ltc.svg'),
    BEP20: () => import('cryptocurrency-icons/svg/color/bnb.svg'),
    BNB: () => import('cryptocurrency-icons/svg/color/bnb.svg'),
    ADA: () => import('cryptocurrency-icons/svg/color/ada.svg'),
  };

  type CoinIconProps = {
    symbol: string; // Example: 'usdt_eth', 'usdt_trc', or 'eth'
  };

  function CoinIcon({ symbol }: CoinIconProps) {
    const [mainIconSrc, setMainIconSrc] = useState<string | null>(null);
    const [chainIconSrc, setChainIconSrc] = useState<string | null>(null);
  
    useEffect(() => {
      const [base, chain] = symbol.toUpperCase().split('_');
  
      const loadMain = iconMap[base];
      const loadChain = chain ? iconMap[chain] : null;
  
      if (loadMain) {
        loadMain().then((mod) => setMainIconSrc(mod.default));
      }
  
      if (loadChain) {
        loadChain().then((mod) => setChainIconSrc(mod.default));
      } else {
        setChainIconSrc(null);
      }
    }, [symbol]);
  
    if (!mainIconSrc) return null;
  
    return (
      <div style={{ position: 'relative', width: 24, height: 24 }}>
        <img src={mainIconSrc} alt={symbol} width={24} height={24} />
        {chainIconSrc && (
          <img
            src={chainIconSrc}
            alt="chain"
            width={12}
            height={12}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              borderRadius: '50%',
              background: 'white', // optional: gives white background behind chain icon
              boxShadow: '0 0 1px rgba(0,0,0,0.4)',
            }}
          />
        )}
      </div>
    );
  }


  const getBadgeColor = (label: string) => {
    const firstWord = label.split(" ")[0].toUpperCase();
    switch (firstWord) {
      case "ERC20":
        return "#3C3C3D"; // grayish
      case "BEP20":
        return "#F7931A"; // orange
      case "TRC20":
        return "#26A17B"; // green
      case "SOL":
        return "#66F9DF"; // teal
      default:
        return "#6B7280"; // Tailwind gray-500 fallback
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[150px] h-9 px-3 py-1 rounded-md !bg-gray-700 !text-white text-sm flex items-center justify-between",
            "hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-ring/50",
            className
          )}
        >
          {selected ? selected.label : "Select"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent  className="z-50 w-[240] p-0 bg-gray-700 text-white border border-white shadow-md rounded-md">
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
                <CoinIcon symbol = {`${token.label.split(" ")[0]}_${token.label.split(" ")[1]}`}/>
                {token.label.split(" ")[0]}
                {
                  token.label.split(" ").length > 1 &&
                  <Badge color={getBadgeColor(token.label.split(" ")[1])}> {token.label.split(" ")[1]} </Badge>
                }
                
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
