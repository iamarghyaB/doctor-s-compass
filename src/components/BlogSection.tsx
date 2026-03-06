import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import blogNutrition from "@/assets/blog-nutrition.jpg";
import blogDetection from "@/assets/blog-detection.jpg";
import blogMyths from "@/assets/blog-myths.jpg";

const posts = [
  {
    img: blogDetection,
    category: "Cancer Prevention",
    title: "Early Cancer Detection: Why Screening Saves Lives",
    excerpt: "Learn about the latest screening methods and why catching cancer early dramatically improves survival rates.",
    date: "Feb 15, 2026",
  },
  {
    img: blogNutrition,
    category: "Nutrition & Wellness",
    title: "Nutrition Tips During Cancer Treatment",
    excerpt: "Discover the best dietary practices to support your body during chemotherapy and radiation therapy.",
    date: "Jan 28, 2026",
  },
  {
    img: blogMyths,
    category: "Education",
    title: "5 Common Cancer Treatment Myths Debunked",
    excerpt: "Separating fact from fiction about modern cancer treatments to help you make informed decisions.",
    date: "Jan 10, 2026",
  },
];

const BlogSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="section-padding" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Health Tips</span>
          <h2 className="section-title mt-2 mb-3">Latest from the Blog</h2>
          <p className="section-subtitle mx-auto">Expert insights and guidance on cancer prevention, treatment, and wellness.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="group bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">{post.category}</span>
                <h3 className="font-heading text-lg font-semibold text-primary mt-3 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <button className="text-accent text-sm font-semibold hover:underline">Read More →</button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
