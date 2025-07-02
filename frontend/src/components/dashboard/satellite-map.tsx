"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

export default function SatelliteMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Create a simple map visualization
    const mapContainer = mapRef.current
    const width = mapContainer.clientWidth
    const height = mapContainer.clientHeight

    // Create canvas for map
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    mapContainer.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a simple map background
    ctx.fillStyle = "#e8e8e8"
    ctx.fillRect(0, 0, width, height)

    // Draw some terrain features
    drawTerrain(ctx, width, height)

    // Draw a marker for the farm location
    const farmX = width * 0.6
    const farmY = height * 0.4

    // Draw a circle for the farm area
    ctx.beginPath()
    ctx.arc(farmX, farmY, 30, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0, 128, 0, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "rgba(0, 128, 0, 0.8)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Add a label
    ctx.fillStyle = "black"
    ctx.font = "14px Arial"
    ctx.fillText("Farm Location", farmX - 45, farmY - 40)

    // Add coordinates
    ctx.font = "12px Arial"
    ctx.fillText("13.5137° N, 2.1098° E", farmX - 60, farmY + 50)

    // Add a scale
    drawMapScale(ctx, width, height)

    // Add a compass
    drawCompass(ctx, width, height)

    return () => {
      if (mapContainer.contains(canvas)) {
        mapContainer.removeChild(canvas)
      }
    }
  }, [])

  const drawTerrain = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw some random terrain features
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 50 + 20

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)

      // Different colors for different terrain
      const terrainType = Math.floor(Math.random() * 3)
      if (terrainType === 0) {
        // Water
        ctx.fillStyle = "rgba(100, 150, 220, 0.3)"
      } else if (terrainType === 1) {
        // Forest
        ctx.fillStyle = "rgba(50, 120, 50, 0.2)"
      } else {
        // Desert
        ctx.fillStyle = "rgba(220, 200, 150, 0.3)"
      }

      ctx.fill()
    }

    // Draw some roads
    ctx.beginPath()
    ctx.moveTo(width * 0.1, height * 0.5)
    ctx.lineTo(width * 0.9, height * 0.5)
    ctx.moveTo(width * 0.5, height * 0.1)
    ctx.lineTo(width * 0.5, height * 0.9)
    ctx.strokeStyle = "rgba(150, 150, 150, 0.5)"
    ctx.lineWidth = 3
    ctx.stroke()
  }

  const drawMapScale = (ctx: CanvasRenderingContext2D, height: number) => {
    const scaleX = 20
    const scaleY = height - 30
    const scaleWidth = 100

    ctx.beginPath()
    ctx.moveTo(scaleX, scaleY)
    ctx.lineTo(scaleX + scaleWidth, scaleY)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.stroke()

    // Add ticks
    ctx.beginPath()
    ctx.moveTo(scaleX, scaleY - 5)
    ctx.lineTo(scaleX, scaleY + 5)
    ctx.moveTo(scaleX + scaleWidth / 2, scaleY - 5)
    ctx.lineTo(scaleX + scaleWidth / 2, scaleY + 5)
    ctx.moveTo(scaleX + scaleWidth, scaleY - 5)
    ctx.lineTo(scaleX + scaleWidth, scaleY + 5)
    ctx.stroke()

    // Add labels
    ctx.fillStyle = "black"
    ctx.font = "10px Arial"
    ctx.fillText("0 km", scaleX - 5, scaleY + 20)
    ctx.fillText("5 km", scaleX + scaleWidth / 2 - 10, scaleY + 20)
    ctx.fillText("10 km", scaleX + scaleWidth - 10, scaleY + 20)
  }

  const drawCompass = (ctx: CanvasRenderingContext2D, width: number) => {
    const compassX = width - 50
    const compassY = 50
    const radius = 20

    // Draw circle
    ctx.beginPath()
    ctx.arc(compassX, compassY, radius, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.fill()
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw N-S-E-W
    ctx.beginPath()
    ctx.moveTo(compassX, compassY - radius + 5)
    ctx.lineTo(compassX, compassY + radius - 5)
    ctx.moveTo(compassX - radius + 5, compassY)
    ctx.lineTo(compassX + radius - 5, compassY)
    ctx.stroke()

    // Add labels
    ctx.fillStyle = "black"
    ctx.font = "10px Arial"
    ctx.fillText("N", compassX - 3, compassY - radius + 12)
    ctx.fillText("S", compassX - 3, compassY + radius - 5)
    ctx.fillText("E", compassX + radius - 12, compassY + 3)
    ctx.fillText("W", compassX - radius + 5, compassY + 3)
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px] bg-gray-100 rounded-md"></div>
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-sm">
        <h3 className="text-sm font-medium">Niger, West Africa</h3>
        <p className="text-xs text-muted-foreground flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          Farmer&apos;s Location
        </p>
      </div>
    </div>
  )
}
