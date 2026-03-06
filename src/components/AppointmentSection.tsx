import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  date: z.date({ required_error: "Select a date" }),
  service: z.string().min(1, "Select a service"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const schedule = [
  { day: "Monday", time: "9:00 AM – 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 5:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 1:00 PM" },
  { day: "Thursday", time: "9:00 AM – 5:00 PM" },
  { day: "Friday", time: "9:00 AM – 3:00 PM" },
  { day: "Saturday", time: "Closed" },
  { day: "Sunday", time: "Closed" },
];

const AppointmentSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        preferred_date: format(data.date, "yyyy-MM-dd"),
        service: data.service,
        message: data.message || "",
      });
      if (error) throw error;
      toast({
        title: "Appointment Requested!",
        description: `Thank you ${data.name}. We'll confirm your appointment for ${format(data.date, "PPP")} shortly.`,
      });
      form.reset();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <section id="appointment" className="section-padding bg-card" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Appointment</span>
          <h2 className="section-title mt-2 mb-3">Book Your Visit</h2>
          <p className="section-subtitle mx-auto">Take the first step towards better health. We're here for you.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto">
          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:w-80 flex-shrink-0"
          >
            <h3 className="font-heading text-xl font-semibold text-primary mb-4">
              <Clock className="inline h-5 w-5 text-accent mr-2" />
              Availability
            </h3>
            <div className="bg-secondary rounded-xl p-5">
              {schedule.map((s) => (
                <div key={s.day} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="font-medium text-sm text-foreground">{s.day}</span>
                  <span className={`text-sm ${s.time === "Closed" ? "text-destructive" : "text-muted-foreground"}`}>{s.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="service" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="screening">Cancer Screening</SelectItem>
                          <SelectItem value="chemotherapy">Chemotherapy</SelectItem>
                          <SelectItem value="radiation">Radiation Therapy</SelectItem>
                          <SelectItem value="immunotherapy">Immunotherapy</SelectItem>
                          <SelectItem value="consultation">Surgical Consultation</SelectItem>
                          <SelectItem value="palliative">Palliative Care</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms / Message</FormLabel>
                    <FormControl><Textarea placeholder="Describe your symptoms or concerns..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base py-5">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : "Request Appointment"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
