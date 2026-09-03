import { formatPrice } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { product } from "@/data/mock"
import { useState } from "react"

export function EmiCalculatorCard() {
  const [selectedIndex, setSelectedIndex] = useState(product.defaultTenureIndex)
  const selected = product.tenureOptions[selectedIndex]

  return (
    <div className="mt-3 border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <svg className="size-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span className="font-bold text-sm text-gray-900">Pay only {formatPrice(product.downPayment)} now</span>
        </div>
        <span className="text-xs text-gray-400">EMIs starting {product.emiStartLabel}</span>
      </div>

      <p className="text-xs font-semibold text-gray-700 mb-2">Choose EMI Tenure</p>
      <RadioGroup value={String(selectedIndex)} onValueChange={(v) => setSelectedIndex(Number(v))} className="flex flex-col gap-1.5">
        {product.tenureOptions.map((option, idx) => (
          <div key={idx} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <RadioGroupItem value={String(idx)} id={`tenure-${idx}`} />
              <label htmlFor={`tenure-${idx}`} className="text-xs text-gray-800 cursor-pointer">{formatPrice(option.monthlyAmount)} × {option.months} months</label>
            </div>
            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">{option.badge}</span>
          </div>
        ))}
      </RadioGroup>

      <p className="mt-2 text-[10px] text-gray-400 italic">*Total extra payment per month/order value</p>
      <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2 rounded-full transition-colors">
        Buy on {selected.months} months EMI
      </button>
    </div>
  )
}
