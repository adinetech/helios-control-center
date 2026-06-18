import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Server, Database, Network, ShieldCheck, Activity, Map } from 'lucide-react';

export const PricingPage = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pricing Strategy & Optimization</h1>
        <p className="text-muted-foreground mt-1">Infrastructure cost estimates, SLAs, and optimization recommendations for SolarOps.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Compute & Storage */}
        <Card className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <Server className="w-8 h-8 text-indigo-500 mb-2" />
            <CardTitle>Compute & Storage</CardTitle>
            <CardDescription>EC2 instances and EBS volumes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Standard Tier (t3.medium)</span>
              <span className="font-medium">$41.61/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Premium Tier (m5.large)</span>
              <span className="font-medium">$138.70/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Storage (500GB gp3)</span>
              <span className="font-medium">$40.00/mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Network & Bandwidth */}
        <Card className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <Network className="w-8 h-8 text-emerald-500 mb-2" />
            <CardTitle>Networking & Bandwidth</CardTitle>
            <CardDescription>VPC, Transit Gateway, Egress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Tailscale VPN / Subnet</span>
              <span className="font-medium">Included (Free Tier)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Data Egress (100GB/mo)</span>
              <span className="font-medium">$9.00/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">NAT Gateway</span>
              <span className="font-medium">$32.40/mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring SLA */}
        <Card className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <Activity className="w-8 h-8 text-amber-500 mb-2" />
            <CardTitle>Monitoring & Analytics</CardTitle>
            <CardDescription>Prometheus, Loki, Grafana Stack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">99.9% Uptime SLA</span>
              <span className="font-medium">$150/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">99.99% Uptime SLA</span>
              <span className="font-medium">$450/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Data Retention (1yr)</span>
              <span className="font-medium">+$50/mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Backup & DR */}
        <Card className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <ShieldCheck className="w-8 h-8 text-red-500 mb-2" />
            <CardTitle>Backup & Disaster Recovery</CardTitle>
            <CardDescription>RPO/RTO aligned strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Standard (24h RPO / 4h RTO)</span>
              <span className="font-medium">$35/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Critical (1h RPO / 15m RTO)</span>
              <span className="font-medium">$120/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Automated Snapshots</span>
              <span className="font-medium">$0.05/GB-mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Region */}
        <Card className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <Map className="w-8 h-8 text-blue-500 mb-2" />
            <CardTitle>Multi-Region Deployment</CardTitle>
            <CardDescription>High Availability & Redundancy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Active-Passive (2 regions)</span>
              <span className="font-medium">+80% Base Cost</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Active-Active (2 regions)</span>
              <span className="font-medium">+150% Base Cost</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Global DB replication</span>
              <span className="font-medium">$100/mo</span>
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <Database className="w-8 h-8 text-purple-500 mb-2" />
            <CardTitle>Database Management</CardTitle>
            <CardDescription>RDS PostgreSQL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Single-AZ (db.t3.micro)</span>
              <span className="font-medium">$13.14/mo</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Multi-AZ (db.t3.medium)</span>
              <span className="font-medium">$52.56/mo</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 p-6 rounded-xl border border-border mt-8">
        <h3 className="font-semibold mb-4">Optimization Recommendations (TCO Reduction)</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Reserved Instances:</strong> Commit to 1-year or 3-year EC2 Reserved Instances to save up to 72% on compute costs.</li>
          <li><strong>Storage Tiering:</strong> Move older telemetry data (older than 3 months) to Amazon S3 Glacier to significantly reduce database storage costs.</li>
          <li><strong>Right-sizing:</strong> Continuously monitor CPU/Memory usage via Grafana and downsize underutilized EC2 instances.</li>
          <li><strong>Spot Instances:</strong> Use EC2 Spot Instances for non-critical batch processing (e.g., generating end-of-month analytical reports) for up to 90% savings.</li>
        </ul>
      </div>
    </div>
  );
};
