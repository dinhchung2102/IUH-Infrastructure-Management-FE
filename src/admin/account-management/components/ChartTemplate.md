Barchart:
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
ChartConfig,
ChartContainer,
ChartTooltip,
ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const chartData = [
{ month: "January", desktop: 186 },
{ month: "February", desktop: 305 },
{ month: "March", desktop: 237 },
{ month: "April", desktop: 73 },
{ month: "May", desktop: 209 },
{ month: "June", desktop: 214 },
]

const chartConfig = {
desktop: {
label: "Desktop",
color: "var(--chart-1)",
},
} satisfies ChartConfig

export function ChartBarLabel() {
return (
<Card>
<CardHeader>
<CardTitle>Bar Chart - Label</CardTitle>
<CardDescription>January - June 2024</CardDescription>
</CardHeader>
<CardContent>
<ChartContainer config={chartConfig}>
<BarChart
accessibilityLayer
data={chartData}
margin={{
              top: 20,
            }} >
<CartesianGrid vertical={false} />
<XAxis
dataKey="month"
tickLine={false}
tickMargin={10}
axisLine={false}
tickFormatter={(value) => value.slice(0, 3)}
/>
<ChartTooltip
cursor={false}
content={<ChartTooltipContent hideLabel />}
/>
<Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
<LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
</Bar>
</BarChart>
</ChartContainer>
</CardContent>
<CardFooter className="flex-col items-start gap-2 text-sm">

<div className="flex gap-2 leading-none font-medium">
Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
</div>
<div className="text-muted-foreground leading-none">
Showing total visitors for the last 6 months
</div>
</CardFooter>
</Card>
)
}

Linechart:
"use client"

import { GitCommitVertical, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
ChartConfig,
ChartContainer,
ChartTooltip,
ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart with custom dots"

const chartData = [
{ month: "January", desktop: 186, mobile: 80 },
{ month: "February", desktop: 305, mobile: 200 },
{ month: "March", desktop: 237, mobile: 120 },
{ month: "April", desktop: 73, mobile: 190 },
{ month: "May", desktop: 209, mobile: 130 },
{ month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
desktop: {
label: "Desktop",
color: "var(--chart-1)",
},
mobile: {
label: "Mobile",
color: "var(--chart-2)",
},
} satisfies ChartConfig

export function ChartLineDotsCustom() {
return (
<Card>
<CardHeader>
<CardTitle>Line Chart - Custom Dots</CardTitle>
<CardDescription>January - June 2024</CardDescription>
</CardHeader>
<CardContent>
<ChartContainer config={chartConfig}>
<LineChart
accessibilityLayer
data={chartData}
margin={{
              left: 12,
              right: 12,
            }} >
<CartesianGrid vertical={false} />
<XAxis
dataKey="month"
tickLine={false}
axisLine={false}
tickMargin={8}
tickFormatter={(value) => value.slice(0, 3)}
/>
<ChartTooltip
cursor={false}
content={<ChartTooltipContent hideLabel />}
/>
<Line
dataKey="desktop"
type="natural"
stroke="var(--color-desktop)"
strokeWidth={2}
dot={({ cx, cy, payload }) => {
const r = 24
return (
<GitCommitVertical
key={payload.month}
x={cx - r / 2}
y={cy - r / 2}
width={r}
height={r}
fill="hsl(var(--background))"
stroke="var(--color-desktop)"
/>
)
}}
/>
</LineChart>
</ChartContainer>
</CardContent>
<CardFooter className="flex-col items-start gap-2 text-sm">

<div className="flex gap-2 leading-none font-medium">
Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
</div>
<div className="text-muted-foreground leading-none">
Showing total visitors for the last 6 months
</div>
</CardFooter>
</Card>
)
}

piechart:
"use client"

import \* as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
ChartConfig,
ChartContainer,
ChartStyle,
ChartTooltip,
ChartTooltipContent,
} from "@/components/ui/chart"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

export const description = "An interactive pie chart"

const desktopData = [
{ month: "january", desktop: 186, fill: "var(--color-january)" },
{ month: "february", desktop: 305, fill: "var(--color-february)" },
{ month: "march", desktop: 237, fill: "var(--color-march)" },
{ month: "april", desktop: 173, fill: "var(--color-april)" },
{ month: "may", desktop: 209, fill: "var(--color-may)" },
]

const chartConfig = {
visitors: {
label: "Visitors",
},
desktop: {
label: "Desktop",
},
mobile: {
label: "Mobile",
},
january: {
label: "January",
color: "var(--chart-1)",
},
february: {
label: "February",
color: "var(--chart-2)",
},
march: {
label: "March",
color: "var(--chart-3)",
},
april: {
label: "April",
color: "var(--chart-4)",
},
may: {
label: "May",
color: "var(--chart-5)",
},
} satisfies ChartConfig

export function ChartPieInteractive() {
const id = "pie-interactive"
const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)

const activeIndex = React.useMemo(
() => desktopData.findIndex((item) => item.month === activeMonth),
[activeMonth]
)
const months = React.useMemo(() => desktopData.map((item) => item.month), [])

return (
<Card data-chart={id} className="flex flex-col">
<ChartStyle id={id} config={chartConfig} />
<CardHeader className="flex-row items-start space-y-0 pb-0">
<div className="grid gap-1">
<CardTitle>Pie Chart - Interactive</CardTitle>
<CardDescription>January - June 2024</CardDescription>
</div>
<Select value={activeMonth} onValueChange={setActiveMonth}>
<SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
<SelectValue placeholder="Select month" />
</SelectTrigger>
<SelectContent align="end" className="rounded-xl">
{months.map((key) => {
const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={desktopData}
              dataKey="desktop"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {desktopData[activeIndex].desktop.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>

)
}
