"use client"

import { useState, useEffect } from "react"
import { 
  Check, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  ClipboardList,
  X
} from "lucide-react"

interface TodoSubItem {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

interface TodoItem {
  id: string
  title: string
  completed: boolean
  subItems: TodoSubItem[]
  isExpanded: boolean
  createdAt: number
}

interface TodoListProps {
  lang?: string
}

export function TodoList({ lang = 'zh' }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState("")
  const [newSubItemTitle, setNewSubItemTitle] = useState<Record<string, string>>({})
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [isAddingSubItem, setIsAddingSubItem] = useState<Record<string, boolean>>({})
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedTodos = localStorage.getItem('theguide-todos')
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos)
        setTodos(parsed)
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theguide-todos', JSON.stringify(todos))
  }, [todos])

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addTodo = () => {
    if (!newTodoTitle.trim()) return
    
    const newTodo: TodoItem = {
      id: generateId(),
      title: newTodoTitle.trim(),
      completed: false,
      subItems: [],
      isExpanded: false,
      createdAt: Date.now()
    }
    
    setTodos(prev => [...prev, newTodo])
    setNewTodoTitle("")
    setIsAddingTodo(false)
  }

  const deleteTodo = (todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId))
  }

  const toggleTodo = (todoId: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        const newCompleted = !todo.completed
        const updatedSubItems = todo.subItems.map(sub => ({
          ...sub,
          completed: newCompleted
        }))
        return {
          ...todo,
          completed: newCompleted,
          subItems: updatedSubItems
        }
      }
      return todo
    }))
  }

  const toggleExpand = (todoId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, isExpanded: !todo.isExpanded } : todo
    ))
  }

  const addSubItem = (todoId: string) => {
    const title = newSubItemTitle[todoId]?.trim()
    if (!title) return
    
    const newSubItem: TodoSubItem = {
      id: generateId(),
      title,
      completed: false,
      createdAt: Date.now()
    }
    
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: [...todo.subItems, newSubItem]
        }
      }
      return todo
    }))
    
    setNewSubItemTitle(prev => ({ ...prev, [todoId]: "" }))
    setIsAddingSubItem(prev => ({ ...prev, [todoId]: false }))
  }

  const deleteSubItem = (todoId: string, subItemId: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: todo.subItems.filter(sub => sub.id !== subItemId)
        }
      }
      return todo
    }))
  }

  const toggleSubItem = (todoId: string, subItemId: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subItems: todo.subItems.map(sub => 
            sub.id === subItemId ? { ...sub, completed: !sub.completed } : sub
          )
        }
      }
      return todo
    }))
  }

  const getCompletedCount = (todo: TodoItem) => {
    const completedSubItems = todo.subItems.filter(sub => sub.completed).length
    return todo.completed ? 1 + completedSubItems : completedSubItems
  }

  const getTotalCount = (todo: TodoItem) => {
    return 1 + todo.subItems.length
  }

  const getOverallStats = () => {
    const total = todos.reduce((sum, todo) => sum + getTotalCount(todo), 0)
    const completed = todos.reduce((sum, todo) => sum + getCompletedCount(todo), 0)
    return { total, completed }
  }

  const stats = getOverallStats()
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const t = (zh: string, en: string) => lang === 'en' ? en : zh

  if (!isMounted) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
        <div className="text-center text-muted-foreground">
          {lang === 'en' ? 'Loading...' : '加载中...'}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {t('待办事项', 'To-Do List')}
          </h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {stats.completed}/{stats.total} {t('已完成', 'completed')}
        </div>
      </div>

      {stats.total > 0 && (
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}

      <div className="mb-4 space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="overflow-hidden rounded-lg border border-border bg-background transition-all hover:border-primary/50"
          >
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  todo.completed
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
              >
                {todo.completed && <Check className="h-3 w-3" />}
              </button>
              
              <button
                onClick={() => toggleExpand(todo.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {todo.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              <span className={`flex-1 text-sm ${
                todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
              }`}>
                {todo.title}
              </span>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {getCompletedCount(todo)}/{getTotalCount(todo)}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {todo.isExpanded && (
              <div className="border-t border-border bg-secondary/50 p-3 pt-2">
                <div className="space-y-2">
                  {todo.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className="flex items-center gap-2 pl-4"
                    >
                      <button
                        onClick={() => toggleSubItem(todo.id, subItem.id)}
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          subItem.completed
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {subItem.completed && <Check className="h-3 w-3" />}
                      </button>
                      
                      <span className={`flex-1 text-xs ${
                        subItem.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}>
                        {subItem.title}
                      </span>
                      
                      <button
                        onClick={() => deleteSubItem(todo.id, subItem.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {isAddingSubItem[todo.id] ? (
                    <div className="flex items-center gap-2 pl-4">
                      <input
                        type="text"
                        value={newSubItemTitle[todo.id] || ""}
                        onChange={(e) => setNewSubItemTitle(prev => ({ 
                          ...prev, 
                          [todo.id]: e.target.value 
                        }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addSubItem(todo.id)
                          if (e.key === 'Escape') setIsAddingSubItem(prev => ({ ...prev, [todo.id]: false }))
                        }}
                        placeholder={t('输入子项...', 'Enter sub-item...')}
                        className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => addSubItem(todo.id)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setIsAddingSubItem(prev => ({ ...prev, [todo.id]: false }))}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingSubItem(prev => ({ ...prev, [todo.id]: true }))}
                      className="flex items-center gap-1 pl-4 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Plus className="h-3 w-3" />
                      {t('添加子项', 'Add sub-item')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAddingTodo ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
              if (e.key === 'Escape') setIsAddingTodo(false)
            }}
            placeholder={t('输入待办事项...', 'Enter a new todo...')}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            autoFocus
          />
          <button
            onClick={addTodo}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsAddingTodo(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTodo(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          {t('添加待办事项', 'Add a new todo')}
        </button>
      )}
    </div>
  )
}
