import { useParams, useNavigate } from 'react-router-dom';
import { useFarmDetails, useFarmTelemetry } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatusBadge } from '../components/ui/status-badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  AreaChart, Area, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { ArrowLeft, Sun, Battery, Zap, Home, Thermometer, TrendingUp } from 'lucide-react';

const Stat = ({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className={`text-2xl font-bold mt-0.5 ${color || ''}`}>
      {value}<span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
    </span>
  </div>
);

const chartStyle = { backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: 12 };

export const FarmDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: farm, isLoading: loadingFarm } = useFarmDetails(id);
  const { data: telemetry, isLoading: loadingTelemetry } = useFarmTelemetry(id);

  if (loadingFarm || loadingTelemetry) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!farm) return <div className="p-8 text-muted-foreground">Farm not found.</div>;

  const latest = telemetry?.[telemetry.length - 1];
  const fmt = (val: any) => format(new Date(val), 'HH:mm');
  const fmtFull = (val: any) => format(new Date(val), 'HH:mm:ss');

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/farms')}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{farm.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {farm.location} · {Number(farm.capacityKw).toLocaleString()} kW installed · {telemetry?.length ?? 0} data points (last 60 min)
            </p>
          </div>
        </div>
        <StatusBadge status={farm.status} />
      </div>

      {/* Live KPI Strip */}
      {latest && (
        <Card className="bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live Now · {fmtFull(latest.timestamp)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              <Stat label="PV1 Power" value={(latest.pv1PowerKw ?? 0).toFixed(3)} unit="kW" color="text-yellow-500" />
              <Stat label="PV2 Power" value={(latest.pv2PowerKw ?? 0).toFixed(3)} unit="kW" color="text-yellow-400" />
              <Stat label="Battery SOC" value={latest.batterySoc ?? 0} unit="%" color="text-green-500" />
              <Stat label="Batt Power" value={(latest.batteryPowerKw ?? 0).toFixed(3)} unit="kW" color={latest.batteryPowerKw > 0 ? 'text-orange-400' : 'text-green-400'} />
              <Stat label="Grid" value={Math.abs(latest.gridPowerKw ?? 0).toFixed(3)} unit="kW" color="text-blue-400" />
              <Stat label="Home Load" value={(latest.loadPowerKw ?? 0).toFixed(3)} unit="kW" color="text-purple-400" />
              <Stat label="Temperature" value={(latest.temperatureC ?? 0).toFixed(1)} unit="°C" color="text-red-400" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solar & Load — full width */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" /> Solar PV Production (kW)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry}>
                <defs>
                  <linearGradient id="g-pv1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-pv2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fde047" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fde047" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip labelFormatter={fmtFull} contentStyle={chartStyle} />
                <Area type="monotone" dataKey="pv1PowerKw" name="PV1 (kW)" stroke="#eab308" fill="url(#g-pv1)" strokeWidth={2} />
                <Area type="monotone" dataKey="pv2PowerKw" name="PV2 (kW)" stroke="#fde047" fill="url(#g-pv2)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2-col charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Battery SOC + Power */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-500" /> Battery SOC & Charge/Discharge (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={telemetry}>
                  <defs>
                    <linearGradient id="g-batt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis yAxisId="r" orientation="right" domain={[0, 100]} stroke="#22c55e" fontSize={11} unit="%" />
                  <Tooltip labelFormatter={fmtFull} contentStyle={chartStyle} />
                  <ReferenceLine yAxisId="l" y={0} stroke="hsl(var(--border))" strokeDasharray="4 2" />
                  <Area yAxisId="l" type="monotone" dataKey="batteryPowerKw" name="Power (kW)" stroke="#16a34a" fill="url(#g-batt)" strokeWidth={2} />
                  <Line yAxisId="r" type="monotone" dataKey="batterySoc" name="SOC %" stroke="#22c55e" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grid Import/Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" /> Grid Import / Export (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetry}>
                  <defs>
                    <linearGradient id="g-grid-pos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="4 2" />
                  <Tooltip labelFormatter={fmtFull} contentStyle={chartStyle} />
                  <Area type="monotone" dataKey="gridPowerKw" name="Grid (kW)" stroke="#3b82f6" fill="url(#g-grid-pos)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Home Load */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Home className="h-4 w-4 text-purple-400" /> Home Load (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetry}>
                  <defs>
                    <linearGradient id="g-load" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip labelFormatter={fmtFull} contentStyle={chartStyle} />
                  <Area type="monotone" dataKey="loadPowerKw" name="Load (kW)" stroke="#a855f7" fill="url(#g-load)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inverter Temperature */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-red-400" /> Inverter Temperature (°C)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetry}>
                  <defs>
                    <linearGradient id="g-temp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['auto', 'auto']} />
                  <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '50°C limit', fill: '#ef4444', fontSize: 10 }} />
                  <Tooltip labelFormatter={fmtFull} contentStyle={chartStyle} />
                  <Area type="monotone" dataKey="temperatureC" name="Temp (°C)" stroke="#ef4444" fill="url(#g-temp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Totals */}
      {latest && (
        <Card className="bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" /> Energy Production Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Stat label="Today's Production" value={(latest.dailyProductionKwh ?? 0).toFixed(1)} unit="kWh" color="text-yellow-500" />
              <Stat label="Total All-Time" value={(latest.totalProductionKwh ?? 0).toFixed(1)} unit="kWh" color="text-yellow-400" />
              <Stat label="Battery Voltage" value={(latest.batteryVoltage ?? 0).toFixed(2)} unit="V" color="text-green-400" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
