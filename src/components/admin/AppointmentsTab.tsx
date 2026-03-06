import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferred_date: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-blue-100 text-blue-800 border-blue-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAppointments(data);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
      toast({ title: "Updated", description: `Status changed to ${status}.` });
    }
  };

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setSelected(null);
      toast({ title: "Deleted", description: "Appointment removed." });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return <p className="text-muted-foreground text-center py-12">No appointment requests yet.</p>;
  }

  return (
    <>
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">{apt.name}</span>
                <Badge variant="outline" className={statusColors[apt.status] || ""}>
                  {apt.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {apt.service} · {format(new Date(apt.preferred_date), "PPP")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Select value={apt.status} onValueChange={(v) => updateStatus(apt.id, v)}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => setSelected(apt)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteAppointment(apt.id)}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Name:</span> {selected.name}</div>
              <div><span className="font-medium">Email:</span> {selected.email}</div>
              <div><span className="font-medium">Phone:</span> {selected.phone}</div>
              <div><span className="font-medium">Service:</span> {selected.service}</div>
              <div><span className="font-medium">Preferred Date:</span> {format(new Date(selected.preferred_date), "PPP")}</div>
              <div><span className="font-medium">Message:</span> {selected.message || "—"}</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant="outline" className={statusColors[selected.status] || ""}>{selected.status}</Badge>
              </div>
              <div><span className="font-medium">Submitted:</span> {format(new Date(selected.created_at), "PPP p")}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentsTab;
