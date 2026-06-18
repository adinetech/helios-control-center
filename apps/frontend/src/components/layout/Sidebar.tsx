import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Factory, AlertTriangle, Users, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Solar Farms', href: '/farms', icon: Factory },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'System Status', href: '/status', icon: Activity },
];

export const Sidebar = () => {
  const role = useAuthStore(s => s.role);

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-black">H</div>
          Helios
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
          <NavLink
            to="/users"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Users className="w-4 h-4" />
            Users
          </NavLink>
        )}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">
        Helios Control Center v0.0.1
      </div>
    </aside>
  );
};
