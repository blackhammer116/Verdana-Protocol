"use client"

import { useEffect, useRef } from "react"

// Simulated satellite images showing tree growth over time
const satelliteImages = [
  "/placeholder.svg?height=400&width=800&text=Initial+Planting",
  "/placeholder.svg?height=400&width=800&text=Early+Growth",
  "/placeholder.svg?height=400&width=800&text=Medium+Growth",
  "/placeholder.svg?height=400&width=800&text=Advanced+Growth",
  "/placeholder.svg?height=400&width=800&text=Mature+Forest",
]

interface TreeGrowthSimulationProps {
  currentImageIndex: number
  ndviValue: number
}

export default function TreeGrowthSimulation({ currentImageIndex, ndviValue }: TreeGrowthSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate NDVI visualization overlay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Load the current satellite image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = satelliteImages[currentImageIndex]

    img.onload = () => {
      // Draw the base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Apply NDVI visualization overlay
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Apply a color overlay based on NDVI value
      // Higher NDVI = more green (healthy vegetation)
      for (let i = 0; i < data.length; i += 4) {
        // Skip white areas (text in placeholder)
        if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) continue

        // Apply NDVI-based coloring
        // Lower NDVI (unhealthy/no vegetation) = brown/yellow
        // Higher NDVI (healthy vegetation) = green
        if (ndviValue < 0.3) {
          // Brown/yellow for low NDVI
          data[i] = 150 + Math.random() * 50 // R
          data[i + 1] = 120 + Math.random() * 40 // G
          data[i + 2] = 50 + Math.random() * 30 // B
        } else if (ndviValue < 0.5) {
          // Yellow-green for medium NDVI
          data[i] = 100 + Math.random() * 40 // R
          data[i + 1] = 150 + Math.random() * 50 // G
          data[i + 2] = 50 + Math.random() * 30 // B
        } else {
          // Green for high NDVI
          data[i] = 30 + Math.random() * 40 // R
          data[i + 1] = 150 + Math.random() * 70 // G
          data[i + 2] = 30 + Math.random() * 40 // B
        }

        // Add some variation for texture
        const variation = Math.random() * 20 - 10
        data[i] = Math.max(0, Math.min(255, data[i] + variation))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation))
      }

      ctx.putImageData(imageData, 0, 0)

      // Add NDVI scale
      drawNDVIScale(ctx, canvas.width, canvas.height)

      // Add timestamp
      const timestamp = new Date().toISOString().split("T")[0]
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(10, 10, 200, 30)
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.fillText(`Satellite Image: ${timestamp}`, 20, 30)

      // Add NDVI value
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(canvas.width - 110, 10, 100, 30)
      ctx.fillStyle = "white"
      ctx.fillText(`NDVI: ${ndviValue.toFixed(2)}`, canvas.width - 100, 30)
    }
  }, [currentImageIndex, ndviValue])

  // Draw NDVI color scale
  const drawNDVIScale = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scaleWidth = 200
    const scaleHeight = 20
    const x = width - scaleWidth - 10
    const y = height - scaleHeight - 10

    // Create gradient
    const gradient = ctx.createLinearGradient(x, y, x + scaleWidth, y)
    gradient.addColorStop(0, "rgb(150, 100, 50)") // Brown (low NDVI)
    gradient.addColorStop(0.5, "rgb(150, 180, 50)") // Yellow-green (medium NDVI)
    gradient.addColorStop(1, "rgb(30, 180, 30)") // Green (high NDVI)

    // Draw scale
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, scaleWidth, scaleHeight)

    // Add border
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, scaleWidth, scaleHeight)

    // Add labels
    ctx.fillStyle = "black"
    ctx.font = "12px Arial"
    ctx.fillText("Low", x, y + scaleHeight + 15)
    ctx.fillText("Medium", x + scaleWidth / 2 - 20, y + scaleHeight + 15)
    ctx.fillText("High", x + scaleWidth - 20, y + scaleHeight + 15)

    // Title
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(x, y - 25, 100, 20)
    ctx.fillStyle = "white"
    ctx.fillText("NDVI Scale", x + 10, y - 10)
  }

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-cover" />
}
