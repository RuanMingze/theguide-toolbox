import React, { useState, useEffect } from 'react'

interface ToolProps {
  onSaveResult?: (data: any) => void
  onExport?: (data: any) => void
}

export default function CalorieCalculatorTool({ onSaveResult, onExport }: ToolProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState<string>('25')
  const [height, setHeight] = useState<string>('170')
  const [weight, setWeight] = useState<string>('70')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg')
  const [activityLevel, setActivityLevel] = useState<number>(1.375)
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain')
  const [bmr, setBmr] = useState<number>(0)
  const [tdee, setTdee] = useState<number>(0)
  const [targetCalories, setTargetCalories] = useState<number>(0)

  useEffect(() => {
    const ageNum = parseInt(age) || 0
    let heightCm = parseFloat(height) || 0
    let weightKg = parseFloat(weight) || 0

    if (heightUnit === 'ft') {
      heightCm = heightCm * 30.48
    }
    if (weightUnit === 'lb') {
      weightKg = weightKg * 0.453592
    }

    let bmrValue
    if (gender === 'male') {
      bmrValue = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) + 5
    } else {
      bmrValue = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) - 161
    }

    setBmr(Math.round(bmrValue))

    const tdeeValue = bmrValue * activityLevel
    setTdee(Math.round(tdeeValue))

    let targetValue
    switch (goal) {
      case 'lose':
        targetValue = tdeeValue - 500
        break
      case 'gain':
        targetValue = tdeeValue + 500
        break
      default:
        targetValue = tdeeValue
    }

    const minCalories = gender === 'male' ? 1500 : 1200
    targetValue = Math.max(targetValue, minCalories)

    setTargetCalories(Math.round(targetValue))
    
    onSaveResult?.({
      type: 'calorie_calculator',
      bmr: Math.round(bmrValue),
      tdee: Math.round(tdeeValue),
      targetCalories: Math.round(targetValue),
      goal,
    })
  }, [gender, age, height, weight, heightUnit, weightUnit, activityLevel, goal, onSaveResult])

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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">热量计算器</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">性别</label>
          <div className="flex gap-2">
            <Button 
              onClick={() => setGender('male')} 
              variant="outline"
              active={gender === 'male'}
              className="flex-1"
            >
              男
            </Button>
            <Button 
              onClick={() => setGender('female')} 
              variant="outline"
              active={gender === 'female'}
              className="flex-1"
            >
              女
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">年龄</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">身高</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="170"
            />
            <select
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value as 'cm' | 'ft')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="cm">cm</option>
              <option value="ft">ft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">体重</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="70"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">活动水平</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={1.2}>久坐不动 (几乎不运动)</option>
            <option value={1.375}>轻度活动 (每周 1-3 天)</option>
            <option value={1.55}>中度活动 (每周 3-5 天)</option>
            <option value={1.725}>高度活动 (每周 6-7 天)</option>
            <option value={1.9}>非常活跃 (体力劳动)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">目标</label>
          <div className="flex gap-2">
            <Button 
              onClick={() => setGoal('maintain')} 
              variant="outline"
              active={goal === 'maintain'}
              className="flex-1"
            >
              保持体重
            </Button>
            <Button 
              onClick={() => setGoal('lose')} 
              variant="outline"
              active={goal === 'lose'}
              className="flex-1"
            >
              减重
            </Button>
            <Button 
              onClick={() => setGoal('gain')} 
              variant="outline"
              active={goal === 'gain'}
              className="flex-1"
            >
              增重
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">基础代谢率 (BMR)</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bmr} <span className="text-sm">卡路里/天</span></div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">每日总消耗 (TDEE)</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{tdee} <span className="text-sm">卡路里/天</span></div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">目标摄入量</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{targetCalories} <span className="text-sm">卡路里/天</span></div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">计算公式说明：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>使用 Mifflin-St Jeor 方程计算 BMR</li>
          <li>TDEE = BMR × 活动系数</li>
          <li>减重：TDEE - 500 卡路里 (每周减约 0.5kg)</li>
          <li>增重：TDEE + 500 卡路里 (每周增约 0.5kg)</li>
        </ul>
      </div>
    </div>
  )
}
