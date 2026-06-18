import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileDown, Target, Zap, Activity, Factory } from 'lucide-react';
import { toast } from 'sonner';

interface ExecutiveReport {
  totalFarms: number;
  totalCapacityMw: number;
  totalProductionMwh: number;
  co2OffsetTons: number;
  fleetUptimePercent: number;
  generatedAt: string;
}

export const ReportsPage = () => {
  const [data, setData] = useState<ExecutiveReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/api/reports/executive');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load executive report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Sites,${data.totalFarms}\n` +
      `Total Fleet Capacity (MW),${data.totalCapacityMw.toFixed(2)}\n` +
      `Total Lifetime Energy (MWh),${data.totalProductionMwh.toFixed(2)}\n` +
      `Estimated CO2 Offset (Tons),${data.co2OffsetTons.toFixed(2)}\n` +
      `Fleet Uptime (%),${data.fleetUptimePercent.toFixed(1)}%\n` +
      `Report Generated,${new Date(data.generatedAt).toLocaleString()}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `solarops_executive_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('CSV Export downloaded successfully');
  };

  if (loading || !data) {
    return <div className="p-8 flex items-center justify-center text-muted-foreground animate-pulse">Generating reports...</div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Summary</h1>
          <p className="text-muted-foreground mt-1">Aggregated fleet-wide performance and sustainability metrics</p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <FileDown className="w-4 h-4" />
          Export CSV Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managed Sites</CardTitle>
            <Factory className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalFarms}</div>
            <p className="text-xs text-muted-foreground mt-1">Active solar installations</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fleet Capacity</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalCapacityMw.toFixed(2)} MW</div>
            <p className="text-xs text-muted-foreground mt-1">Total operational rating</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Energy</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{data.totalProductionMwh.toFixed(1)} MWh</div>
            <p className="text-xs text-muted-foreground mt-1">Total clean energy generated</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CO₂ Offset</CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.co2OffsetTons.toFixed(1)} t</div>
            <p className="text-xs text-muted-foreground mt-1">Metric tons of carbon avoided</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Sustainability Impact</CardTitle>
            <CardDescription>Environmental benefits of the operational fleet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-medium">Total CO₂ Avoided</span>
              <span className="font-bold text-emerald-500">{data.co2OffsetTons.toFixed(2)} Tons</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="font-medium">Equivalent Trees Planted</span>
              <span className="font-bold text-blue-500">{Math.round(data.co2OffsetTons * 45).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="font-medium">Homes Powered (Yearly)</span>
              <span className="font-bold text-amber-500">{Math.round(data.totalProductionMwh / 10.5).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>Fleet Availability</CardTitle>
            <CardDescription>System-wide operational status</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="relative flex items-center justify-center w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/20" />
                <circle
                  cx="96" cy="96" r="80"
                  stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - data.fleetUptimePercent / 100)}
                  className="text-emerald-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-emerald-500">{data.fleetUptimePercent.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground mt-1">Uptime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
