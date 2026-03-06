import { motion } from "framer-motion";
import { Users, Clock, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import doctorImg from "@/assets/doctor-hero.jpg";

const stats = [
  { icon: Users, value: "5,000+", label: "Patients Treated" },
  { icon: Clock, value: "15+", label: "Years Experience" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
  { icon: Award, value: "20+", label: "Awards" },
];

const HeroSection = () => {
  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 pt-28 md:pt-36 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-center lg:text-left"
        >
          <span className="inline-block bg-accent/10 text-accent font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
            Senior Oncologist & Cancer Specialist
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary leading-tight mb-6">
            Fighting Cancer With Science & Compassion
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0">
            Providing specialized oncology care with cutting-edge treatments and a
            patient-first approach. Because every life deserves the best chance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              onClick={() => scrollTo("#appointment")}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 text-base"
            >
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("#about")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 text-base"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative">
            <div className="w-72 h-80 md:w-80 md:h-[28rem] rounded-2xl overflow-hidden shadow-2xl border-4 border-card">
              <img
                src={doctorImg}
                alt="Dr. Sarah Mitchell, Senior Oncologist"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-card rounded-xl p-5 shadow-lg border border-border/50 text-center animate-float"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary font-heading">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
