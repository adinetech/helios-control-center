import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, CheckCircle, Database, Server } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export const StatusPage = () => {
  const { data: health, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => (await api.get('/api/health')).data,
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  const isHealthy = health?.status === 'ok';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            {isHealthy ? <CheckCircle className="h-10 w-10 text-emerald-500" /> : <Activity className="h-10 w-10 text-destructive" />}
            <div>
              <div className="text-2xl font-bold">{isHealthy ? 'Operational' : 'Degraded'}</div>
              <p className="text-sm text-muted-foreground">Version {health?.info?.version?.version || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{health?.details?.database?.status || 'Unknown'}</div>
            <p className="text-sm text-muted-foreground">PostgreSQL Cluster</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Raw Health Check Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-muted-foreground">
              {JSON.stringify(health, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
