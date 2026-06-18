import { useAuthStore } from '../../store/auth';
import { CommandMenu } from './CommandMenu';
import { LogOut, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export const Topbar = () => {
  const { email, role, logout } = useAuthStore();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <CommandMenu />
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 h-9 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors outline-none cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                <User className="w-3 h-3 text-foreground" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-medium leading-none">{email}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{role}</span>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
