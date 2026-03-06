import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, Building2 } from "lucide-react";

const chambers = [
  {
    name: "City Cancer Hospital",
    address: "123 Medical Drive, Downtown",
    days: "Monday, Wednesday, Friday",
    time: "9:00 AM – 1:00 PM",
    phone: "+1 (555) 100-2000",
  },
  {
    name: "National Oncology Clinic",
    address: "456 Health Ave, Midtown",
    days: "Monday, Thursday",
    time: "2:00 PM – 5:00 PM",
  },
  {
    name: "Green Life Medical Center",
    address: "789 Wellness Blvd, Uptown",
    days: "Tuesday, Saturday",
    time: "10:00 AM – 2:00 PM",
  },
  {
    name: "Hope Specialty Hospital",
    address: "321 Care Lane, Eastside",
    days: "Wednesday, Friday",
    time: "3:00 PM – 6:00 PM",
  },
];

const ChamberScheduleSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="chambers" className="section-padding bg-background" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Chamber Schedule
          </span>
          <h2 className="section-title mt-2 mb-3">Visit Us At</h2>
          <p className="section-subtitle mx-auto">
            Dr. Mitchell is available at multiple hospitals and clinics throughout the week.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {chambers.map((chamber, i) => (
            <motion.div
              key={chamber.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {chamber.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                    <span>{chamber.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="font-medium">{chamber.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Days:</span> {chamber.days}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChamberScheduleSection;
