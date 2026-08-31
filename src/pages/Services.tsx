import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Pill, Radiation, ShieldCheck, Stethoscope, HeartHandshake,
  ArrowLeft, CheckCircle2, type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import Footer from "@/components/Footer";

type Service = Tables<"services">;

const iconMap: Record<string, LucideIcon> = {
  Search, Pill, Radiation, ShieldCheck, Stethoscope, HeartHandshake,
};

const highlights = [
  "Personalised treatment plans",
  "Multidisciplinary tumour board review",
  "Continuous follow-up and monitoring",
];

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Oncology Services | Dr. Sarah Mitchell";
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Oncology Services</h1>
          <p className="max-w-2xl opacity-90 leading-relaxed">
            Comprehensive, evidence-based cancer care — from early screening and accurate diagnosis
            through advanced treatment and compassionate long-term support.
          </p>
        </div>
      </header>

      <main className="section-padding">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading services…</p>
          ) : services.length === 0 ? (
            <p className="text-center text-muted-foreground">Services will be published soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((s, i) => {
                const Icon = iconMap[s.icon] || Stethoscope;
                return (
                  <motion.article
                    key={s.id}
                    id={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: (i % 2) * 0.1 }}
                    className="bg-card rounded-xl p-8 border border-border/50 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-accent" />
                    </div>
                    <h2 className="font-heading text-2xl font-semibold text-primary mb-3">{s.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-5">{s.description}</p>
                    <ul className="space-y-2 mb-6">
                      {highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/#appointment"
                      className="inline-flex items-center text-accent font-semibold text-sm hover:underline"
                    >
                      Book a consultation →
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
