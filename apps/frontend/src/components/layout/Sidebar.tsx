import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Factory, AlertTriangle, Users, Activity, Sun, FileBarChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Solar Farms', href: '/farms', icon: Factory },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'System Status', href: '/status', icon: Activity },
];

const adminNavItems = [
  { name: 'Executive Reports', href: '/reports', icon: FileBarChart },
  { name: 'Users', href: '/users', icon: Users },
];

export const Sidebar = () => {
  const role = useAuthStore(s => s.role);

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #f59e0b, #ef4444)'}}>
            <Sun className="w-4 h-4 text-white" />
          </div>
          <span>SolarOps</span>
          <span style={{fontSize:'0.6rem', background:'rgba(245,158,11,0.15)', color:'#f59e0b', padding:'1px 6px', borderRadius:10, border:'1px solid rgba(245,158,11,0.3)', fontWeight:700}}>CLOUD</span>
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
        {role === 'ADMIN' && (
          <div className="pt-4 mt-4 border-t space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </div>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">
        SolarOps v1.0.0
      </div>
    </aside>
  );
};
