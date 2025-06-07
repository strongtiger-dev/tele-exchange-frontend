import { ArrowLeftRight, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SwitchButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="!border !border-white rounded-full p-2 hover:bg-white/10 transition-colors"
      variant="ghost"
      size="icon"
    >
      {/* Desktop: Left/Right arrow */}
      <ArrowLeftRight className="hidden md:block text-white w-5 h-5" />
      {/* Mobile: Up/Down arrow */}
      <ArrowUpDown className="block md:hidden text-white w-5 h-5" />
    </Button>
  )
}