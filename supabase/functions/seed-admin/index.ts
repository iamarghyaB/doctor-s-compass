import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Create admin user
  const email = "admin@clinic.com";
  const password = "admin123456";

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  let userId: string;
  if (existing) {
    userId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    userId = data.user.id;
  }

  // Assign admin role
  await supabase.from("user_roles").upsert(
    { user_id: userId, role: "admin" },
    { onConflict: "user_id,role" }
  );

  // Seed services
  const { count } = await supabase.from("services").select("*", { count: "exact", head: true });
  if (!count || count === 0) {
    await supabase.from("services").insert([
      { title: "Cancer Diagnosis & Screening", description: "Comprehensive screening with advanced imaging and biopsy techniques for early cancer detection.", icon: "Search", sort_order: 0 },
      { title: "Chemotherapy", description: "Personalized chemotherapy regimens designed to maximize effectiveness while minimizing side effects.", icon: "Pill", sort_order: 1 },
      { title: "Radiation Therapy", description: "State-of-the-art radiation treatments including IMRT and stereotactic radiosurgery.", icon: "Radiation", sort_order: 2 },
      { title: "Immunotherapy", description: "Cutting-edge immunotherapy treatments that harness your body's immune system to fight cancer.", icon: "ShieldCheck", sort_order: 3 },
      { title: "Surgical Oncology Consultation", description: "Expert surgical planning and consultation for tumor removal and cancer staging.", icon: "Stethoscope", sort_order: 4 },
      { title: "Palliative Care", description: "Compassionate symptom management and quality of life support throughout treatment.", icon: "HeartHandshake", sort_order: 5 },
    ]);
  }

  // Seed chambers
  const { count: cCount } = await supabase.from("chambers").select("*", { count: "exact", head: true });
  if (!cCount || cCount === 0) {
    await supabase.from("chambers").insert([
      { name: "City Cancer Hospital", address: "123 Medical Drive, Downtown", days: "Monday, Wednesday, Friday", time: "9:00 AM – 1:00 PM", phone: "+1 (555) 100-2000", sort_order: 0 },
      { name: "National Oncology Clinic", address: "456 Health Ave, Midtown", days: "Monday, Thursday", time: "2:00 PM – 5:00 PM", sort_order: 1 },
      { name: "Green Life Medical Center", address: "789 Wellness Blvd, Uptown", days: "Tuesday, Saturday", time: "10:00 AM – 2:00 PM", sort_order: 2 },
      { name: "Hope Specialty Hospital", address: "321 Care Lane, Eastside", days: "Wednesday, Friday", time: "3:00 PM – 6:00 PM", sort_order: 3 },
    ]);
  }

  // Seed site content
  const { count: sCount } = await supabase.from("site_content").select("*", { count: "exact", head: true });
  if (!sCount || sCount === 0) {
    await supabase.from("site_content").insert([
      // About section
      { section: "about", key: "title", value: "Dr. Mitchell" },
      { section: "about", key: "subtitle", value: "Senior Oncologist & Cancer Specialist" },
      { section: "about", key: "description", value: "With over 15 years of dedicated experience in oncology, Dr. Mitchell has been at the forefront of cancer treatment and research. Board-certified in Medical Oncology with fellowship training at Johns Hopkins, bringing world-class expertise to every patient." },
      { section: "about", key: "education", value: "MD from Harvard Medical School, Fellowship at Johns Hopkins" },
      { section: "about", key: "certifications", value: "Board Certified Medical Oncologist, ASCO Member, ESMO Member" },
      // Contact section
      { section: "contact", key: "phone", value: "+1 (555) 123-4567" },
      { section: "contact", key: "email", value: "contact@drmitchell.com" },
      { section: "contact", key: "address", value: "123 Medical Center Blvd, Suite 200, New York, NY 10001" },
      { section: "contact", key: "hours", value: "Mon-Fri: 9:00 AM - 5:00 PM" },
      // Hero section
      { section: "hero", key: "headline", value: "Fighting Cancer With Science & Compassion" },
      { section: "hero", key: "subtext", value: "Providing specialized oncology care with cutting-edge treatments and a patient-first approach. Because every life deserves the best chance." },
    ]);
  }

  return new Response(
    JSON.stringify({ success: true, message: "Admin seeded. Login: admin@clinic.com / admin123456" }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
