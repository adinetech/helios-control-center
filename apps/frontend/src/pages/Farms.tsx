import { useFarms } from '../hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { StatusBadge } from '../components/ui/status-badge';
import { Skeleton } from '../components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Pencil, Plus, Trash2, Sun, X } from 'lucide-react';
import { api } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface Farm {
  id: string;
  name: string;
  location: string;
  capacityKw: number;
  status: string;
}

interface FarmFormData {
  name: string;
  location: string;
  capacityKw: number | string;
  status: string;
}

const STATUS_OPTIONS = ['ONLINE', 'OFFLINE', 'MAINTENANCE', 'WARNING'];

export const FarmsPage = () => {
  const { data: farms, isLoading } = useFarms();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingFarm, setEditingFarm] = useState<Farm | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState<FarmFormData>({ name: '', location: '', capacityKw: 5, status: 'ONLINE' });

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  const openEdit = (farm: Farm) => {
    setForm({ name: farm.name, location: farm.location, capacityKw: farm.capacityKw, status: farm.status });
    setSaveError('');
    setEditingFarm(farm);
  };

  const openCreate = () => {
    setForm({ name: '', location: '', capacityKw: 5, status: 'ONLINE' });
    setSaveError('');
    setEditingFarm(null);
  };

  const closeModal = () => {
    setEditingFarm(undefined);
    setSaveError('');
    setSaving(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setSaveError('Name is required'); return; }
    setSaving(true);
    setSaveError('');
    try {
      const payload = { ...form, capacityKw: Number(form.capacityKw) };
      if (editingFarm?.id) {
        await api.put(`/api/farms/${editingFarm.id}`, payload);
      } else {
        await api.post('/api/farms', payload);
      }
      await queryClient.invalidateQueries({ queryKey: ['farms'] });
      closeModal();
    } catch (e: any) {
      setSaveError(e?.response?.data?.message || 'Save failed — check permissions');
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this installation?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/farms/${id}`);
      await queryClient.invalidateQueries({ queryKey: ['farms'] });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ---- Inline Modal ---- */}
      {editingFarm !== undefined && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-card border rounded-2xl p-7 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-bold">{editingFarm ? 'Edit Installation' : 'New Installation'}</h2>
              </div>
              <button onClick={closeModal} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name *</span>
                <input
                  autoFocus
                  className="mt-1 w-full px-3 py-2 rounded-lg border bg-muted/30 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Adine's Home"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</span>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-lg border bg-muted/30 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Colombo, Sri Lanka"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capacity (kW)</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="mt-1 w-full px-3 py-2 rounded-lg border bg-muted/30 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={form.capacityKw}
                  onChange={e => setForm(f => ({ ...f, capacityKw: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-lg border bg-muted/30 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            {saveError && (
              <p className="mt-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                ⚠️ {saveError}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingFarm ? 'Save Changes' : 'Create'}
              </button>
              <button
                onClick={closeModal}
                className="py-2 px-4 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Page ---- */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solar Installations</h1>
          <p className="text-muted-foreground text-sm mt-1">{farms?.length ?? 0} registered sites</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Installation
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Registered Installations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity (kW)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farms?.map((farm: Farm) => (
                <TableRow
                  key={farm.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/farms/${farm.id}`)}
                >
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      <Sun className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
                      {farm.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{farm.location}</TableCell>
                  <TableCell>{Number(farm.capacityKw).toLocaleString()} kW</TableCell>
                  <TableCell><StatusBadge status={farm.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(farm); }}
                        className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(farm.id, e)}
                        disabled={deletingId === farm.id}
                        className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {farms?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No installations registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
