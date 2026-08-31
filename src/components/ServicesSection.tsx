import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Search, Pill, Radiation, ShieldCheck, Stethoscope, HeartHandshake, type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

const iconMap: Record<string, LucideIcon> = {
  Search, Pill, Radiation, ShieldCheck, Stethoscope, HeartHandshake,
};

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="section-title mt-2 mb-3">Comprehensive Cancer Care</h2>
          <p className="section-subtitle mx-auto">Advanced treatments tailored to your unique condition with compassion at every step.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Stethoscope;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{s.description}</p>
                <Link to={`/services#${s.id}`} className="text-accent text-sm font-semibold hover:underline">Learn More →</Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/services" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
