import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  status?: "success" | "warning" | "danger" | "neutral"
}

export function MetricCard({ title, value, status = "neutral" }: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "danger":
        return "text-red-500"
      default:
        return "text-white"
    }
  }

  return (
    <Card className="bg-[#252538] border-gray-700">
      <CardContent className="p-6 flex flex-col justify-between min-h-[140px]">
        <div className="flex flex-col items-center text-center">
          <span className={`text-4xl font-bold ${getStatusColor(status)} leading-tight`}>{value}</span>
          <span className="text-sm font-medium text-gray-400 mt-2">{title}</span>
        </div>
      </CardContent>
    </Card>
  )
}
