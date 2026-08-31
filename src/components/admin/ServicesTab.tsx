import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

type Faq = { question: string; answer: string };

const toList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

const toFaqs = (v: unknown): Faq[] =>
  Array.isArray(v)
    ? v
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map((x) => ({ question: String(x.question ?? ""), answer: String(x.answer ?? "") }))
    : [];

const ServicesTab = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const patch = (id: string, field: keyof Service, value: unknown) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } as Service : s)));

  const addService = async () => {
    const { data, error } = await supabase
      .from("services")
      .insert({
        title: "New Service",
        description: "",
        icon: "Stethoscope",
        category: "General",
        sort_order: services.length,
      })
      .select()
      .single();
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    if (data) {
      setServices((prev) => [...prev, data]);
      setOpenId(data.id);
    }
  };

  const saveService = async (s: Service) => {
    setSavingId(s.id);
    const { error } = await supabase
      .from("services")
      .update({
        title: s.title,
        description: s.description,
        icon: s.icon,
        category: s.category,
        image_url: s.image_url,
        duration: s.duration,
        price_info: s.price_info,
        long_description: s.long_description,
        benefits: s.benefits,
        faqs: s.faqs,
        sort_order: s.sort_order,
      })
      .eq("id", s.id);
    setSavingId(null);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Saved", description: `"${s.title}" has been updated.` });
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Deleted", description: "Service removed." });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((s) => {
        const benefits = toList(s.benefits);
        const faqs = toFaqs(s.faqs);
        const open = openId === s.id;
        return (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <button
                className="flex items-center gap-2 text-left font-semibold text-primary text-sm"
                onClick={() => setOpenId(open ? null : s.id)}
              >
                {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {s.title || "Untitled service"}
                <span className="text-xs font-normal text-muted-foreground">({s.category})</span>
              </button>
              <div className="flex items-center gap-1">
                <Button size="sm" onClick={() => saveService(s)} disabled={savingId === s.id}>
                  {savingId === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeService(s.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {open && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input placeholder="Service title" value={s.title} onChange={(e) => patch(s.id, "title", e.target.value)} />
                  <Input placeholder="Category (e.g. Treatment)" value={s.category ?? ""} onChange={(e) => patch(s.id, "category", e.target.value)} />
                  <Input placeholder="Icon name (Search, Pill, Radiation…)" value={s.icon} onChange={(e) => patch(s.id, "icon", e.target.value)} />
                  <Input placeholder="Image URL" value={s.image_url ?? ""} onChange={(e) => patch(s.id, "image_url", e.target.value)} />
                  <Input placeholder="Duration (e.g. 45 minutes)" value={s.duration ?? ""} onChange={(e) => patch(s.id, "duration", e.target.value)} />
                  <Input placeholder="Pricing info (e.g. From $250)" value={s.price_info ?? ""} onChange={(e) => patch(s.id, "price_info", e.target.value)} />
                </div>
                <Textarea placeholder="Short description" rows={2} value={s.description} onChange={(e) => patch(s.id, "description", e.target.value)} />
                <Textarea placeholder="Full description" rows={4} value={s.long_description ?? ""} onChange={(e) => patch(s.id, "long_description", e.target.value)} />

                <div>
                  <label className="text-sm font-medium mb-1 block">Benefits (one per line)</label>
                  <Textarea
                    rows={3}
                    value={benefits.join("\n")}
                    onChange={(e) => patch(s.id, "benefits", e.target.value.split("\n").filter((l) => l.trim() !== ""))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block">FAQs</label>
                  {faqs.map((f, i) => (
                    <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto] items-start">
                      <Input
                        placeholder="Question"
                        value={f.question}
                        onChange={(e) => patch(s.id, "faqs", faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))}
                      />
                      <Textarea
                        rows={2}
                        placeholder="Answer"
                        value={f.answer}
                        onChange={(e) => patch(s.id, "faqs", faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))}
                      />
                      <Button variant="ghost" size="sm" onClick={() => patch(s.id, "faqs", faqs.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => patch(s.id, "faqs", [...faqs, { question: "", answer: "" }])}>
                    <Plus className="mr-1 h-4 w-4" /> Add FAQ
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button variant="outline" onClick={addService} className="w-full border-dashed">
        <Plus className="mr-2 h-4 w-4" /> Add Service
      </Button>
    </div>
  );
};

export default ServicesTab;
