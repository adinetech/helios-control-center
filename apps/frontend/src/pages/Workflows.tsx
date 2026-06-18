import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, Clock, XCircle, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  farm: { name: string } | null;
  assignee: { name: string } | null;
}

const statusColors = {
  PENDING: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  IN_PROGRESS: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  APPROVED: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  REJECTED: 'text-red-500 bg-red-500/10 border-red-500/20',
  COMPLETED: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: Activity,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  COMPLETED: CheckCircle2,
};

export const WorkflowsPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/api/tasks/${id}/status`, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center text-muted-foreground animate-pulse">Loading workflows...</div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Management</h1>
          <p className="text-muted-foreground mt-1">Manage operational tasks, maintenance tickets, and approval chains</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kanban Board Columns */}
        {['PENDING', 'IN_PROGRESS', 'APPROVED'].map((columnStatus) => (
          <div key={columnStatus} className="flex flex-col gap-4">
            <h3 className="font-semibold text-muted-foreground flex items-center justify-between">
              {columnStatus.replace('_', ' ')}
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {tasks.filter(t => t.status === columnStatus).length}
              </span>
            </h3>
            
            <div className="flex flex-col gap-4 min-h-[500px] p-2 bg-card/20 rounded-xl border border-border/50">
              {tasks.filter(t => t.status === columnStatus).map((task) => {
                const Icon = statusIcons[task.status as keyof typeof statusIcons] || Clock;
                
                return (
                  <Card key={task.id} className="border-border bg-card/80 backdrop-blur shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
                        <span className={`text-[10px] px-2 py-1 rounded-full border whitespace-nowrap ${statusColors[task.status as keyof typeof statusColors]}`}>
                          {task.status}
                        </span>
                      </div>
                      <CardDescription className="text-xs line-clamp-2 mt-1">
                        {task.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                        {task.farm && (
                          <div className="flex items-center gap-2">
                            <Factory className="w-3 h-3" />
                            {task.farm.name}
                          </div>
                        )}
                        {task.assignee && (
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            {task.assignee.name}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                          
                          {/* Quick Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {columnStatus === 'PENDING' && (
                              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, 'IN_PROGRESS') }}>Start</Button>
                            )}
                            {columnStatus === 'IN_PROGRESS' && (
                              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, 'APPROVED') }}>Approve</Button>
                            )}
                            {columnStatus === 'APPROVED' && (
                              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, 'COMPLETED') }}>Complete</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple User icon stub to avoid another lucide import issue
const User = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const Activity = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const Factory = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M17 18h1" />
    <path d="M12 18h1" />
    <path d="M7 18h1" />
  </svg>
);
