import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search, Pill, Radiation, ShieldCheck, Stethoscope, HeartHandshake, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Search, title: "Cancer Diagnosis & Screening", desc: "Comprehensive screening with advanced imaging and biopsy techniques for early cancer detection." },
  { icon: Pill, title: "Chemotherapy", desc: "Personalized chemotherapy regimens designed to maximize effectiveness while minimizing side effects." },
  { icon: Radiation, title: "Radiation Therapy", desc: "State-of-the-art radiation treatments including IMRT and stereotactic radiosurgery." },
  { icon: ShieldCheck, title: "Immunotherapy", desc: "Cutting-edge immunotherapy treatments that harness your body's immune system to fight cancer." },
  { icon: Stethoscope, title: "Surgical Oncology Consultation", desc: "Expert surgical planning and consultation for tumor removal and cancer staging." },
  { icon: HeartHandshake, title: "Palliative Care", desc: "Compassionate symptom management and quality of life support throughout treatment." },
];

const plans = [
  {
    name: "Initial Consultation",
    price: "$150",
    features: ["30-minute consultation", "Medical history review", "Preliminary assessment", "Treatment recommendations"],
  },
  {
    name: "Full Diagnosis Package",
    price: "$750",
    featured: true,
    features: ["Complete screening", "Lab work & imaging", "Biopsy if needed", "Detailed diagnosis report", "Follow-up consultation"],
  },
  {
    name: "Treatment Plan",
    price: "$1,200",
    features: ["Comprehensive treatment plan", "Multi-specialist coordination", "Monthly follow-ups", "24/7 care support line"],
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="section-title mt-2 mb-3">Comprehensive Cancer Care</h2>
          <p className="section-subtitle mx-auto">Advanced treatments tailored to your unique condition with compassion at every step.</p>
        </div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <s.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{s.desc}</p>
              <button className="text-accent text-sm font-semibold hover:underline">Learn More →</button>
            </motion.div>
          ))}
        </div>

        {/* Pricing */}
        <div className="text-center mb-10">
          <h3 className="section-title text-2xl md:text-3xl">Pricing Plans</h3>
          <p className="section-subtitle mx-auto mt-2">Transparent pricing with no hidden costs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`rounded-xl p-6 border ${
                plan.featured
                  ? "teal-gradient text-accent-foreground border-accent shadow-xl scale-105"
                  : "bg-card border-border/50 shadow-sm"
              }`}
            >
              <h4 className={`font-heading text-lg font-semibold mb-1 ${plan.featured ? "" : "text-primary"}`}>{plan.name}</h4>
              <p className={`text-3xl font-bold font-heading mb-4 ${plan.featured ? "" : "text-primary"}`}>{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span className={plan.featured ? "opacity-90" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full font-semibold ${
                  plan.featured
                    ? "bg-card text-primary hover:bg-card/90"
                    : "bg-accent text-accent-foreground hover:bg-accent/90"
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
