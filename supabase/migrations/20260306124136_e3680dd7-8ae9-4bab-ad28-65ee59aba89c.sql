
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Chambers are publicly readable" ON public.chambers;
CREATE POLICY "Chambers are publicly readable" ON public.chambers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site content is publicly readable" ON public.site_content;
CREATE POLICY "Site content is publicly readable" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;
CREATE POLICY "Anyone can insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage chambers" ON public.chambers;
CREATE POLICY "Admins can manage chambers" ON public.chambers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can read roles" ON public.user_roles;
CREATE POLICY "Admins can read roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
