import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex flex-col w-full h-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
