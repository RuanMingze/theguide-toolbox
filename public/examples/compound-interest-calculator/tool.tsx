import React, { useState, useEffect } from 'react'

interface ToolProps {
  onSaveResult?: (data: any) => void
  onExport?: (data: any) => void
}

interface YearResult {
  year: number
  principal: number
  interest: number
  total: number
  monthlyDeposit: number
}

export default function CompoundInterestCalculatorTool({ onSaveResult, onExport }: ToolProps) {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(10000)
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(1000)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [years, setYears] = useState<number>(10)
  const [compoundFrequency, setCompoundFrequency] = useState<number>(12)
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false)
  const [inflationRate, setInflationRate] = useState<number>(2)
  const [results, setResults] = useState<YearResult[]>([])

  useEffect(() => {
    const data: YearResult[] = []
    let total = initialPrincipal
    let totalPrincipal = initialPrincipal
    let totalInterest = 0
    const monthlyRate = (annualRate / 100) / compoundFrequency

    for (let year = 1; year <= years; year++) {
      const yearStartPrincipal = total
      
      for (let month = 0; month < 12; month++) {
        total = total * (1 + monthlyRate) + monthlyDeposit
        totalPrincipal += monthlyDeposit
      }
      
      totalInterest = total - totalPrincipal
      
      data.push({
        year,
        principal: totalPrincipal,
        interest: totalInterest,
        total: total,
        monthlyDeposit: monthlyDeposit * 12 * year,
      })
    }

    setResults(data)
    
    const finalResult = data[data.length - 1]
    if (finalResult) {
      onSaveResult?.({
        type: 'compound_interest',
        finalTotal: finalResult.total,
        finalPrincipal: finalResult.principal,
        finalInterest: finalResult.interest,
        years,
        annualRate,
      })
    }
  }, [initialPrincipal, monthlyDeposit, annualRate, years, compoundFrequency, onSaveResult])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const Button = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'default',
    active = false
  }: any) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all'
    const variants = {
      default: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      outline: `border-2 ${active ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300'}`,
    }

    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }

  const finalResult = results[results.length - 1]
  const realValue = finalResult && adjustForInflation
    ? finalResult.total / Math.pow(1 + inflationRate / 100, years)
    : 0

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">复利计算器</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">初始本金 (元)</label>
          <input
            type="number"
            value={initialPrincipal}
            onChange={(e) => setInitialPrincipal(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">每月定投 (元)</label>
          <input
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">年化收益率 (%)</label>
          <input
            type="number"
            value={annualRate}
            onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">投资年限 (年)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">复利频率</label>
          <select
            value={compoundFrequency}
            onChange={(e) => setCompoundFrequency(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={1}>每年复利</option>
            <option value={4}>每季度复利</option>
            <option value={12}>每月复利</option>
            <option value={365}>每日复利</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">通胀调整</label>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setAdjustForInflation(!adjustForInflation)} 
              variant="outline"
              active={adjustForInflation}
              className="flex-1"
            >
              {adjustForInflation ? '开启' : '关闭'}
            </Button>
            {adjustForInflation && (
              <input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="2"
              />
            )}
          </div>
        </div>
      </div>

      {finalResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">总本金</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(finalResult.principal)}</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">总利息</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(finalResult.interest)}</div>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">最终总额</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(finalResult.total)}</div>
          </div>
          {adjustForInflation && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg md:col-span-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">考虑通胀后的实际价值 ({inflationRate}% 年通胀率)</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(realValue)}</div>
            </div>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">年份</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">总本金</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">总利息</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">总额</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">累计定投</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white">{row.year}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white">{formatCurrency(row.principal)}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white">{formatCurrency(row.interest)}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(row.total)}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white">{formatCurrency(row.monthlyDeposit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">复利计算公式：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>每月复利：A = P(1 + r/12)^(12t) + PMT × [((1 + r/12)^(12t) - 1) / (r/12)]</li>
          <li>P = 初始本金，r = 年利率，t = 年数，PMT = 每月定投</li>
          <li>复利频率越高，最终收益越大</li>
          <li>通胀会降低货币的实际购买力</li>
        </ul>
      </div>
    </div>
  )
}
