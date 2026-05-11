"use client";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  count: number;
}

export default function UsageChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const formatAnalyticsData = (apiData: ChartData[]): ChartData[] => {
    const today = new Date();
    const fullWeek = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      
      const key = d.toISOString().split("T")[0];
      
      const displayDate = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      const found = apiData.find((item) => item.date === key);
      
      fullWeek.push({
        date: displayDate,
        count: found ? found.count : 0,
      });
    }

    return fullWeek;
  };

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/user/analytics");
        if (!res.ok) throw new Error("Network response was not ok");
        const apiResult: ChartData[] = await res.json();
        const formattedData = formatAnalyticsData(apiResult);
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="h-64 flex items-center justify-center text-zinc-500 bg-zinc-900/20 rounded-3xl border border-zinc-800">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-medium uppercase tracking-widest">Synchronizing...</span>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] backdrop-blur-2xl relative overflow-hidden group">
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-blue-600/5 blur-[100px] group-hover:bg-blue-600/10 transition-all duration-700" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 md:mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Live Analytics</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            API Activity <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
          </h3>
          <p className="text-zinc-500 text-xs md:text-sm">Last 7 days usage</p>
        </div>
        

        <div className="w-full sm:w-auto bg-zinc-950/50 border border-zinc-800 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-left sm:text-right">
          <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Requests</p>
          <p className="text-2xl md:text-3xl font-black text-white font-mono leading-none">
            {data.reduce((a, b) => a + b.count, 0)}
          </p>
        </div>
      </div>

      <div className="h-[220px] md:h-[280px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#27272a" strokeOpacity={0.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#71717a', fontSize: 10, fontWeight: 500}} 
              dy={10}
              interval={1} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#71717a', fontSize: 10}}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#09090b", 
                border: "#27272a 1px solid", 
                borderRadius: "12px",
                padding: "8px 12px",
                fontSize: "12px"
              }}
              cursor={{stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4'}}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
              dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 3, fill: '#09090b' }}
              activeDot={{ stroke: '#fff', strokeWidth: 3, r: 5, fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}