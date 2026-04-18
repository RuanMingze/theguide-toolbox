import React, { useState } from 'react'

interface ToolProps {
  onSaveResult?: (data: any) => void
  onExport?: (data: any) => void
}

export default function CalculatorTool({ onSaveResult, onExport }: ToolProps) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<string>('')

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
    setHistory('')
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
  }

  const inputPercent = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(String(inputValue))
      setHistory(`${inputValue} ${getOperationSymbol(nextOperation)}`)
    } else if (operation) {
      const currentValue = parseFloat(previousValue)
      const result = calculate(currentValue, inputValue, operation)
      
      setDisplay(String(result))
      setPreviousValue(String(result))
      setHistory(`${result} ${getOperationSymbol(nextOperation)}`)
      
      onSaveResult?.({
        type: 'calculator',
        expression: `${currentValue} ${getOperationSymbol(operation)} ${inputValue} = ${result}`,
        result,
      })
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '×':
        return left * right
      case '÷':
        return right !== 0 ? left / right : 0
      default:
        return right
    }
  }

  const getOperationSymbol = (op: string): string => {
    const symbols: Record<string, string> = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷',
    }
    return symbols[op] || op
  }

  const handleEquals = () => {
    if (!operation || previousValue === null) return

    const inputValue = parseFloat(display)
    const currentValue = parseFloat(previousValue)
    const result = calculate(currentValue, inputValue, operation)

    setDisplay(String(result))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
    setHistory(`${currentValue} ${getOperationSymbol(operation)} ${inputValue} = ${result}`)

    onSaveResult?.({
      type: 'calculator',
      expression: `${currentValue} ${getOperationSymbol(operation)} ${inputValue} = ${result}`,
      result,
    })
  }

  const Button = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'default' 
  }: { 
    children: React.ReactNode
    onClick: () => void
    className?: string
    variant?: 'default' | 'primary' | 'secondary' | 'accent'
  }) => {
    const baseStyles = 'h-14 rounded-lg font-medium transition-all active:scale-95'
    const variants = {
      default: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white',
      accent: 'bg-orange-500 hover:bg-orange-600 text-white',
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

  return (
    <div className="max-w-md mx-auto p-4">
      {/* 显示屏 */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="text-right text-sm text-gray-500 dark:text-gray-400 h-6 mb-1">
          {history}
        </div>
        <div className="text-right text-4xl font-bold text-gray-900 dark:text-white truncate">
          {display}
        </div>
      </div>

      {/* 按钮区域 */}
      <div className="grid grid-cols-4 gap-2">
        {/* 第一行 */}
        <Button onClick={clear} variant="secondary">AC</Button>
        <Button onClick={clearEntry} variant="secondary">CE</Button>
        <Button onClick={inputPercent} variant="secondary">%</Button>
        <Button onClick={() => performOperation('/')} variant="primary">÷</Button>

        {/* 第二行 */}
        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button onClick={() => performOperation('*')} variant="primary">×</Button>

        {/* 第三行 */}
        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button onClick={() => performOperation('-')} variant="primary">−</Button>

        {/* 第四行 */}
        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button onClick={() => performOperation('+')} variant="primary">+</Button>

        {/* 第五行 */}
        <Button onClick={toggleSign} variant="secondary">±</Button>
        <Button onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button onClick={handleEquals} variant="accent">=</Button>
      </div>

      {/* 使用说明 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1">使用说明：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>点击数字键输入数值</li>
          <li>选择运算符后进行下一步计算</li>
          <li>按 = 键得出结果</li>
          <li>AC 清空所有，CE 清除当前输入</li>
        </ul>
      </div>
    </div>
  )
}
