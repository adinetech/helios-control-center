import { useDashboardSummary, useDashboardHistory } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Server, AlertCircle, Sun, Battery, Zap, Home, Thermometer, TrendingUp, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, BarChart, Bar, ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { EnergyFlow } from '../components/EnergyFlow';

// ── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({
  icon: Icon, label, value, unit, sub, color, iconBg,
}: {
  icon: any; label: string; value: string | number; unit?: string;
  sub?: string; color: string; iconBg: string;
}) => (
  <Card className="flex flex-col gap-0 p-5">
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
    <p className={`mt-3 text-3xl font-bold ${color}`}>
      {value}
      <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
    </p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </Card>
);

const cs = { backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: 11 };
const fmt = (v: any) => format(new Date(v), 'HH:mm');
const fmtFull = (v: any) => format(new Date(v), 'HH:mm:ss');

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ children, status }: { children: React.ReactNode; status: string }) => {
  const colors: Record<string, string> = {
    charging: 'bg-green-500/10 text-green-500 border-green-500/20',
    discharging: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    importing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    exporting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    warning: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || ''}`}>
      {children}
    </span>
  );
};

const HealthBadge = ({ children, status }: { children: React.ReactNode; status: 'ok' | 'error' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-mono border ${
    status === 'ok' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'
  }`}>
    <span className={`mr-2 h-1.5 w-1.5 rounded-full ${status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
    {children}
  </span>
);

// ── Dashboard Page ────────────────────────────────────────────────────────────
export const DashboardPage = () => {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: history, isLoading: isLoadingHistory } = useDashboardHistory();

  if (isLoadingSummary || isLoadingHistory) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-[420px] w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const lastUpdated = summary?.telemetry?.latestUpdate
    ? format(new Date(summary.telemetry.latestUpdate), 'HH:mm:ss')
    : 'N/A';
  const ext = summary?.extended || {};

  const battStatus = ext.batteryPowerKw > 0 ? 'discharging' : ext.batteryPowerKw < 0 ? 'charging' : null;
  const gridStatus = ext.gridPowerKw > 0 ? 'importing' : ext.gridPowerKw < 0 ? 'exporting' : null;

  const alerts: string[] = [];
  if (ext.temperatureC > 45) alerts.push('High Inverter Temperature — check ventilation');
  if (ext.batterySoc < 20) alerts.push('Battery SOC Low — consider load shedding');
  if (ext.gridPowerKw > 5) alerts.push('High Grid Import Detected');
  if (summary?.overview?.warnings > 0) alerts.push('Active communication warnings on remote nodes');

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solar Operations Center</h1>
          <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            System Online · Last Updated: {lastUpdated}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {battStatus && <StatusBadge status={battStatus}>{battStatus === 'charging' ? '⚡ Charging' : '🔋 Discharging'}</StatusBadge>}
          {gridStatus && <StatusBadge status={gridStatus}>{gridStatus === 'importing' ? '↓ Grid Import' : '↑ Grid Export'}</StatusBadge>}
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Sun} label="Solar PV" color="text-yellow-500" iconBg="bg-yellow-500/10"
          value={(ext.totalPvPowerKw ?? ext.pv1PowerKw + ext.pv2PowerKw ?? 0).toFixed(3)} unit="kW"
          sub={`PV1: ${(ext.pv1PowerKw ?? 0).toFixed(3)} · PV2: ${(ext.pv2PowerKw ?? 0).toFixed(3)}`}
        />
        <KpiCard
          icon={Battery} label="Battery" color={ext.batteryPowerKw > 0 ? 'text-orange-400' : 'text-green-500'} iconBg="bg-green-500/10"
          value={(Math.abs(ext.batteryPowerKw ?? 0)).toFixed(3)} unit="kW"
          sub={`SOC: ${ext.batterySoc ?? 0}% · ${ext.batteryVoltage?.toFixed(1) ?? 0} V`}
        />
        <KpiCard
          icon={Home} label="Home Load" color="text-purple-400" iconBg="bg-purple-500/10"
          value={(ext.loadPowerKw ?? 0).toFixed(3)} unit="kW"
          sub="Current consumption"
        />
        <KpiCard
          icon={Zap} label="Grid" color={ext.gridPowerKw < 0 ? 'text-purple-400' : 'text-blue-400'} iconBg="bg-blue-500/10"
          value={Math.abs(ext.gridPowerKw ?? 0).toFixed(3)} unit="kW"
          sub={ext.gridPowerKw < 0 ? 'Exporting to grid' : ext.gridPowerKw > 0 ? 'Importing from grid' : 'Grid idle'}
        />
      </div>

      {/* ── Energy Summary Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="col-span-1 p-4 flex flex-col gap-1 border-l-4 border-l-yellow-500 bg-yellow-500/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Yield</span>
          <span className="text-2xl font-bold text-yellow-500">{(ext.dailyProductionKwh ?? 0).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kWh</span></span>
        </Card>
        <Card className="col-span-1 p-4 flex flex-col gap-1 border-l-4 border-l-green-500 bg-green-500/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All-Time Total</span>
          <span className="text-2xl font-bold text-green-500">{(ext.totalProductionKwh ?? 0).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kWh</span></span>
        </Card>
        <Card className="col-span-1 p-4 flex flex-col gap-1 border-l-4 border-l-red-400 bg-red-500/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inverter Temp</span>
          <span className="text-2xl font-bold text-red-400">{(ext.temperatureC ?? 0).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">°C</span></span>
        </Card>
        <Card className="col-span-1 p-4 flex flex-col gap-1 border-l-4 border-l-blue-400 bg-blue-500/5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data Points</span>
          <span className="text-2xl font-bold text-blue-400">{summary?.telemetry?.totalRecords?.toLocaleString() ?? '—'}</span>
        </Card>
      </div>

      {/* ── Energy Flow Centerpiece ─────────────────────────────────────── */}
      <EnergyFlow
        solarPower={ext.totalPvPowerKw ?? (ext.pv1PowerKw ?? 0) + (ext.pv2PowerKw ?? 0)}
        batteryPower={ext.batteryPowerKw ?? 0}
        gridPower={ext.gridPowerKw ?? 0}
        homePower={ext.loadPowerKw ?? 0}
        batterySoc={ext.batterySoc ?? 0}
      />

      {/* ── Analytics Charts ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Solar PV History */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" /> Solar PV History (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gPv1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPv2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fde047" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fde047" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Area type="monotone" dataKey="pv1PowerKw" name="PV1 (kW)" stroke="#eab308" fill="url(#gPv1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="pv2PowerKw" name="PV2 (kW)" stroke="#fde047" fill="url(#gPv2)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Battery SOC */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-500" /> Battery SOC (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gSoc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                  <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="4 2" />
                  <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 2" />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Area type="monotone" dataKey="batterySoc" name="SOC %" stroke="#22c55e" fill="url(#gSoc)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Battery Power */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-400" /> Battery Power (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gBattPow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="4 2" />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Area type="monotone" dataKey="batteryPowerKw" name="Power (kW)" stroke="#f97316" fill="url(#gBattPow)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Home Load */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Home className="h-4 w-4 text-purple-400" /> Home Load (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Area type="monotone" dataKey="loadPowerKw" name="Load (kW)" stroke="#a855f7" fill="url(#gLoad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grid Import/Export */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" /> Grid Import / Export (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gGrid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="4 2" />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Area type="monotone" dataKey="gridPowerKw" name="Grid (kW)" stroke="#3b82f6" fill="url(#gGrid)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inverter Temperature */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-red-400" /> Inverter Temp (°C)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['auto', 'auto']} />
                  <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 2" />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Area type="monotone" dataKey="temperatureC" name="Temp (°C)" stroke="#ef4444" fill="url(#gTemp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Energy Production Bar */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" /> Daily Energy Yield per Interval (kWh)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Bar dataKey="dailyProductionKwh" name="Daily kWh" fill="#eab308" opacity={0.85} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Load vs Solar Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" /> Load vs Solar (kW)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="timestamp" tickFormatter={fmt} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip labelFormatter={fmtFull} contentStyle={cs} />
                  <Line type="monotone" dataKey="loadPowerKw" name="Load (kW)" stroke="#a855f7" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pv1PowerKw" name="PV1 (kW)" stroke="#eab308" strokeWidth={2} dot={false} strokeDasharray="5 2" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ── Alerts & Infrastructure ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={alerts.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Active Alerts & Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <ul className="space-y-2">
                {alerts.map((a, i) => (
                  <li key={i} className="text-sm border-l-2 border-destructive pl-3 py-1 text-destructive/90">{a}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No active operational alerts. All systems nominal.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Server className="h-4 w-4" /> Infrastructure Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <HealthBadge status="ok">Deye Inverter Comms</HealthBadge>
              <HealthBadge status="ok">Tailscale VPN</HealthBadge>
              <HealthBadge status="ok">Backend Core</HealthBadge>
              <HealthBadge status="ok">PostgreSQL</HealthBadge>
              <HealthBadge status="ok">Prometheus / Loki</HealthBadge>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
