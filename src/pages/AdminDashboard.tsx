import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Stethoscope, LogOut, Building2, Briefcase, Info, Phone, Plus, Trash2, Save, Loader2, CalendarCheck,
} from "lucide-react";
import AppointmentsTab from "@/components/admin/AppointmentsTab";
import type { Tables } from "@/integrations/supabase/types";

type Chamber = Tables<"chambers">;
type Service = Tables<"services">;
type SiteContent = Tables<"site_content">;

const tabs = [
  { id: "appointments", label: "Appointments", icon: CalendarCheck },
  { id: "chambers", label: "Chambers", icon: Building2 },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: Phone },
] as const;

type TabId = (typeof tabs)[number]["id"];

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("appointments");
  const [saving, setSaving] = useState(false);

  // Data states
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [c, s, sc] = await Promise.all([
      supabase.from("chambers").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("site_content").select("*"),
    ]);
    if (c.data) setChambers(c.data);
    if (s.data) setServices(s.data);
    if (sc.data) setSiteContent(sc.data);
  };

  const getContent = (section: string, key: string) =>
    siteContent.find((c) => c.section === section && c.key === key)?.value ?? "";

  const setContent = (section: string, key: string, value: string) => {
    setSiteContent((prev) => {
      const existing = prev.find((c) => c.section === section && c.key === key);
      if (existing) {
        return prev.map((c) => (c.section === section && c.key === key ? { ...c, value } : c));
      }
      return [...prev, { id: crypto.randomUUID(), section, key, value, created_at: "", updated_at: "" }];
    });
  };

  // Chambers CRUD
  const addChamber = () => {
    setChambers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", address: "", days: "", time: "", phone: "", sort_order: prev.length, created_at: "", updated_at: "" },
    ]);
  };

  const updateChamber = (id: string, field: keyof Chamber, value: string | number) => {
    setChambers((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeChamber = (id: string) => {
    setChambers((prev) => prev.filter((c) => c.id !== id));
  };

  // Services CRUD
  const addService = () => {
    setServices((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", description: "", icon: "Stethoscope", sort_order: prev.length, created_at: "", updated_at: "" },
    ]);
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      if (activeTab === "chambers") {
        // Delete all then re-insert
        await supabase.from("chambers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (chambers.length > 0) {
          const { error } = await supabase.from("chambers").insert(
            chambers.map((c, i) => ({ name: c.name, address: c.address, days: c.days, time: c.time, phone: c.phone, sort_order: i }))
          );
          if (error) throw error;
        }
      } else if (activeTab === "services") {
        await supabase.from("services").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (services.length > 0) {
          const { error } = await supabase.from("services").insert(
            services.map((s, i) => ({ title: s.title, description: s.description, icon: s.icon, sort_order: i }))
          );
          if (error) throw error;
        }
      } else if (activeTab === "about") {
        // Save both about and hero sections
        const items = siteContent.filter((c) => c.section === "about" || c.section === "hero");
        for (const item of items) {
          await supabase.from("site_content").upsert(
            { section: item.section, key: item.key, value: item.value },
            { onConflict: "section,key" }
          );
        }
      } else {
        const sectionItems = siteContent.filter((c) => c.section === activeTab);
        for (const item of sectionItems) {
          await supabase.from("site_content").upsert(
            { section: item.section, key: item.key, value: item.value },
            { onConflict: "section,key" }
          );
        }
      }

      await fetchAll();
      toast({ title: "Saved!", description: "Changes have been saved successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-accent" />
          <span className="font-heading text-lg font-bold text-primary">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-muted-foreground hover:text-accent">← View Site</a>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-card border-r border-border min-h-[calc(100vh-57px)] p-4 hidden md:block">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/70 hover:bg-secondary"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-medium ${
                activeTab === tab.id ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4 mb-1" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 pb-20 md:pb-6 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-primary capitalize">{activeTab}</h2>
            <Button onClick={saveAll} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>

          {/* Appointments Tab */}
          {activeTab === "appointments" && <AppointmentsTab />}

          {/* Chambers Tab */}
          {activeTab === "chambers" && (
            <div className="space-y-4">
              {chambers.map((chamber) => (
                <div key={chamber.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary text-sm">Chamber</h3>
                    <Button variant="ghost" size="sm" onClick={() => removeChamber(chamber.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Hospital/Clinic Name" value={chamber.name} onChange={(e) => updateChamber(chamber.id, "name", e.target.value)} />
                    <Input placeholder="Address" value={chamber.address} onChange={(e) => updateChamber(chamber.id, "address", e.target.value)} />
                    <Input placeholder="Days (e.g. Mon, Wed, Fri)" value={chamber.days} onChange={(e) => updateChamber(chamber.id, "days", e.target.value)} />
                    <Input placeholder="Time (e.g. 9AM - 1PM)" value={chamber.time} onChange={(e) => updateChamber(chamber.id, "time", e.target.value)} />
                    <Input placeholder="Phone (optional)" value={chamber.phone ?? ""} onChange={(e) => updateChamber(chamber.id, "phone", e.target.value)} />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addChamber} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" /> Add Chamber
              </Button>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary text-sm">Service</h3>
                    <Button variant="ghost" size="sm" onClick={() => removeService(service.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Service Title" value={service.title} onChange={(e) => updateService(service.id, "title", e.target.value)} />
                    <Input placeholder="Icon name (e.g. Search, Pill)" value={service.icon} onChange={(e) => updateService(service.id, "icon", e.target.value)} />
                  </div>
                  <Textarea placeholder="Description" value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)} rows={2} />
                </div>
              ))}
              <Button variant="outline" onClick={addService} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Doctor Name</label>
                <Input value={getContent("about", "title")} onChange={(e) => setContent("about", "title", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Subtitle / Specialization</label>
                <Input value={getContent("about", "subtitle")} onChange={(e) => setContent("about", "subtitle", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <Textarea value={getContent("about", "description")} onChange={(e) => setContent("about", "description", e.target.value)} rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Education</label>
                <Input value={getContent("about", "education")} onChange={(e) => setContent("about", "education", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Certifications</label>
                <Input value={getContent("about", "certifications")} onChange={(e) => setContent("about", "certifications", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Hero Headline</label>
                <Input value={getContent("hero", "headline")} onChange={(e) => setContent("hero", "headline", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Hero Subtext</label>
                <Textarea value={getContent("hero", "subtext")} onChange={(e) => setContent("hero", "subtext", e.target.value)} rows={3} />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                <Input value={getContent("contact", "phone")} onChange={(e) => setContent("contact", "phone", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input value={getContent("contact", "email")} onChange={(e) => setContent("contact", "email", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Address</label>
                <Textarea value={getContent("contact", "address")} onChange={(e) => setContent("contact", "address", e.target.value)} rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Working Hours</label>
                <Input value={getContent("contact", "hours")} onChange={(e) => setContent("contact", "hours", e.target.value)} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
