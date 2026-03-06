import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { GraduationCap, Award, BadgeCheck, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import aboutImg from "@/assets/doctor-about.jpg";

const milestones = [
  { year: "2009", text: "MD from Johns Hopkins School of Medicine" },
  { year: "2013", text: "Fellowship in Medical Oncology, Mayo Clinic" },
  { year: "2016", text: "Founded Cancer Hope Clinic" },
  { year: "2020", text: "Named Top Oncologist by National Cancer Institute" },
  { year: "2024", text: "Published 40+ research papers on immunotherapy" },
];

const awards = [
  { icon: Award, text: "National Cancer Research Award" },
  { icon: GraduationCap, text: "Board Certified Oncologist" },
  { icon: BadgeCheck, text: "Fellow, American College of Oncology" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_content").select("*").eq("section", "about").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((d) => (map[d.key] = d.value));
        setContent(map);
      }
    });
  }, []);

  const description = content.description || "With over 15 years of experience in oncology, Dr. Sarah Mitchell combines cutting-edge cancer treatments with compassionate patient care.";

  return (
    <section id="about" className="section-padding bg-card" ref={ref}>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={aboutImg} alt="Dr. Mitchell with patient" className="w-full h-80 md:h-[28rem] object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              About {content.title || "Dr. Mitchell"}
            </span>
            <h2 className="section-title mt-2 mb-4">Dedicated to Healing, Driven by Hope</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

            {content.education && (
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">Education:</span> {content.education}
              </p>
            )}
            {content.certifications && (
              <p className="text-sm text-muted-foreground mb-6">
                <span className="font-semibold text-foreground">Certifications:</span> {content.certifications}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              {awards.map((a) => (
                <div key={a.text} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-sm">
                  <a.icon className="h-4 w-4 text-accent" />
                  <span className="text-foreground/80">{a.text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex items-center gap-2 min-w-[4rem]">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="font-bold text-primary text-sm">{m.year}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{m.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
