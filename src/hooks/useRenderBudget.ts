'use client'

import { useEffect, useState, useRef } from 'react'

interface RenderBudgetConfig {
  targetFPS: number
  maxFrameTime: number
  batteryThreshold: number
}

interface RenderBudget {
  shouldRender: boolean
  currentFPS: number
  frameTime: number
  batteryLevel: number | null
  isLowPower: boolean
  adaptiveQuality: 'high' | 'medium' | 'low'
}

const DEFAULT_CONFIG: RenderBudgetConfig = {
  targetFPS: 60,
  maxFrameTime: 16.67, // 60fps = ~16.67ms per frame
  batteryThreshold: 0.2, // 20% battery
}

export function useRenderBudget(config: Partial<RenderBudgetConfig> = {}): RenderBudget {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const [budget, setBudget] = useState<RenderBudget>({
    shouldRender: true,
    currentFPS: 60,
    frameTime: 16.67,
    batteryLevel: null,
    isLowPower: false,
    adaptiveQuality: 'high'
  })

  const frameTimeRef = useRef<number[]>([])
  const lastFrameRef = useRef<number>(performance.now())
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    let isVisible = !document.hidden
    
    const updateBudget = () => {
      const now = performance.now()
      const deltaTime = now - lastFrameRef.current
      lastFrameRef.current = now

      // Track frame times for FPS calculation
      frameTimeRef.current.push(deltaTime)
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift()
      }

      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length
      const currentFPS = 1000 / avgFrameTime

      // Check battery status
      let batteryLevel: number | null = null
      let isLowPower = false

      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          batteryLevel = battery.level
          isLowPower = batteryLevel < finalConfig.batteryThreshold
        }).catch(() => {
          // Fallback for browsers without battery API
          batteryLevel = null
        })
      }

      // Determine adaptive quality
      let adaptiveQuality: 'high' | 'medium' | 'low' = 'high'
      
      if (isLowPower || !isVisible) {
        adaptiveQuality = 'low'
      } else if (currentFPS < finalConfig.targetFPS * 0.8 || avgFrameTime > finalConfig.maxFrameTime * 1.5) {
        adaptiveQuality = 'medium'
      }

      // Decide whether to render
      const shouldRender = isVisible && (
        adaptiveQuality === 'high' || 
        (adaptiveQuality === 'medium' && avgFrameTime < finalConfig.maxFrameTime * 2) ||
        (adaptiveQuality === 'low' && avgFrameTime < finalConfig.maxFrameTime * 4)
      )

      setBudget({
        shouldRender,
        currentFPS,
        frameTime: avgFrameTime,
        batteryLevel,
        isLowPower,
        adaptiveQuality
      })

      if (shouldRender) {
        animationFrameRef.current = requestAnimationFrame(updateBudget)
      }
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && !animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateBudget)
      } else if (!isVisible && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationFrameRef.current = requestAnimationFrame(updateBudget)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [finalConfig])

  return budget
}