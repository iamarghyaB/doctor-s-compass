import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What types of cancer do you treat?", a: "We specialize in breast, lung, colorectal, prostate, and blood cancers. Dr. Mitchell also provides consultations for rare and complex cases." },
  { q: "How long does the initial consultation take?", a: "The first consultation typically lasts 30–45 minutes. We review your medical history, discuss symptoms, and recommend next steps." },
  { q: "What should I bring to my first appointment?", a: "Please bring your insurance card, medical records, list of current medications, any recent lab results or imaging, and a list of questions." },
  { q: "Do you accept insurance?", a: "Yes, we accept most major insurance plans. Please contact our office to verify your specific plan coverage before your visit." },
  { q: "What are the side effects of chemotherapy?", a: "Side effects vary by treatment but may include fatigue, nausea, hair loss, and immune suppression. We create personalized plans to manage and minimize side effects." },
  { q: "How often will I need to visit during treatment?", a: "Visit frequency depends on your treatment plan. Chemotherapy patients typically visit weekly or bi-weekly. We tailor schedules to your needs." },
  { q: "Do you offer second opinions?", a: "Absolutely. We welcome patients seeking a second opinion and provide thorough, independent assessments of your diagnosis and treatment plan." },
  { q: "What support services are available for patients and families?", a: "We offer counseling, support groups, nutritional guidance, and palliative care services. Our team is dedicated to supporting you and your family through every step." },
];

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="section-padding bg-card" ref={ref}>
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="section-title mt-2 mb-3">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto">Find answers to common questions about our practice and treatments.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-background rounded-lg border border-border/50 px-5">
                <AccordionTrigger className="text-left font-heading text-base font-semibold text-primary hover:text-accent hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
