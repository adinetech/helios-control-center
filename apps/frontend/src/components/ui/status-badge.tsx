import { Badge } from './badge';
import { cn } from '../../lib/utils';

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    ONLINE: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20',
    OFFLINE: 'bg-zinc-500/15 text-zinc-500 hover:bg-zinc-500/25 border-zinc-500/20',
    WARNING: 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20',
    MAINTENANCE: 'bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/20',
  };

  return (
    <Badge variant="outline" className={cn("font-medium", map[status] || map.OFFLINE)}>
      {status}
    </Badge>
  );
};
