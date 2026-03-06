import { Stethoscope, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: "Subscribed!", description: "You'll receive our health tips newsletter." });
      setEmail("");
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-6 w-6 text-accent" />
              <span className="font-heading text-xl font-bold">Dr. Mitchell</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Compassionate Care. Advanced Treatment. New Hope.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {["Home", "About", "Services", "Blog", "FAQ", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="hover:text-accent transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {["Cancer Screening", "Chemotherapy", "Radiation Therapy", "Immunotherapy", "Palliative Care"].map((s) => (
                <li key={s}><span>{s}</span></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Newsletter</h4>
            <p className="text-sm opacity-70 mb-3">Get health tips delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm opacity-50">
          © {new Date().getFullYear()} Dr. Sarah Mitchell. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
