'use client';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useQuery } from 'react-query';
import { getBarChartNewThreads } from '@/apis/dashboard';

const chartConfig = {
  desktop: {
    label: 'newThreads',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;
export function NewThreadsChart() {
  const { data: dataBarChartNewThreads } = useQuery({
    queryKey: ['get-bar-chart-new-threads'],
    queryFn: () => {
      return getBarChartNewThreads();
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Threads</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={dataBarChartNewThreads}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="newThreads" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="newThreads" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
