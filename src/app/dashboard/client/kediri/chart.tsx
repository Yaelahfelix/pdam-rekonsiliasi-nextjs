"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import type { ChartConfig } from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  totalLbr: {
    label: "Total Lembar",
    color: "#2563eb",
  },
} satisfies ChartConfig

export function BarChartDashboard({
  data,
}: {
  data: {
    kasir: string
    totalLbr: number
  }[]
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Total Lembar</CardTitle>
        <CardDescription>Bulan ini</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} className="h-full">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="kasir"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="totalLbr"
              fill="#2563eb"
              radius={8}
              className="w-full"
              height={100}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Dihitung dari total lembar tiap pelanggan
        </div>
      </CardFooter> */}
    </Card>
  )
}
