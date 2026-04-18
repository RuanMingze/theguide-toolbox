/**
 * setImmediate polyfill for Edge Runtime
 * 使用 setTimeout 实现兼容
 * 
 * Edge Runtime 不支持 MessageChannel，使用 setTimeout 作为降级方案
 */

// 检查是否在 Edge Runtime 环境中
const isEdgeRuntime = typeof globalThis !== 'undefined' && 
  // @ts-ignore - Edge Runtime 检测
  typeof EdgeRuntime === 'string'

// 如果原生 setImmediate 不存在，使用 setTimeout polyfill
if (typeof globalThis.setImmediate === 'undefined' || isEdgeRuntime) {
  // 实现 setImmediate
  globalThis.setImmediate = (callback: (...args: any[]) => void, ...args: any[]) => {
    // 使用 setTimeout 模拟，延迟为 0
    const id = setTimeout(() => {
      callback(...args)
    }, 0)
    
    // 返回一个兼容的句柄
    return id as any
  }
  
  // 实现 clearImmediate
  globalThis.clearImmediate = (handle: any) => {
    clearTimeout(handle)
  }
}

// 导出以确保模块被加载
export {}
