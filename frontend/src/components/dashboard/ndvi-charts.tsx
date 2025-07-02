"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface NDVIChartProps {
  currentNDVI: number
  timeElapsed: number
}

export default function NDVIChart({ currentNDVI, timeElapsed }: NDVIChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [
      {
        label: "NDVI Value",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
    ],
  })

  useEffect(() => {
    // Only update chart when time is divisible by 7 (same as when we update the NDVI)
    if (timeElapsed % 7 === 0 || timeElapsed === 0) {
      setChartData((prevData) => {
        // Create a copy of the previous data
         const newLabels = [...prevData.labels]
        const newData = [...prevData.datasets[0].data]

        // Add new data point
        const monthLabel = Math.floor(timeElapsed / 30)
        if (timeElapsed === 0) {
          newLabels.push("Start")
        } else {
          newLabels.push(`Month ${monthLabel}`)
        }
        newData.push(currentNDVI)

        // Keep only the last 12 data points
        if (newLabels.length > 12) {
          newLabels.shift()
          newData.shift()
        }

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        }
      })
    }
  }, [currentNDVI, timeElapsed])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "NDVI Values Over Time",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `NDVI: ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: "NDVI Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  }

  return (
    <div className="h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  )
}
