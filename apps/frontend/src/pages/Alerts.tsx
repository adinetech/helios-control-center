import { useFarms } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const AlertsPage = () => {
  const { data: farms, isLoading } = useFarms();
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  const warnings = farms?.filter((f: any) => f.status === 'WARNING') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Alerts</h1>
        <p className="text-muted-foreground">Monitor system warnings and maintenance requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Anomalies</CardTitle>
          <CardDescription>Farms currently requiring operator attention.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {warnings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/20">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-medium">All Systems Nominal</h3>
              <p className="text-muted-foreground">No active warnings across the network.</p>
            </div>
          ) : (
            warnings.map((farm: any) => (
              <Alert key={farm.id} variant="destructive" className="cursor-pointer hover:bg-destructive/10 transition-colors" onClick={() => navigate(`/farms/${farm.id}`)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning at {farm.name}</AlertTitle>
                <AlertDescription>
                  Abnormal telemetry detected at {farm.location} (Capacity: {farm.capacityKw} kW). Investigation required.
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
