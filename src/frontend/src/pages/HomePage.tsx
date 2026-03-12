import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Star, Target, Users, Zap } from "lucide-react";
import { type Variants, motion } from "motion/react";

const BATCHES = [
  {
    id: "9th",
    label: "9th Class",
    subtitle: "Foundation & Concepts",
    icon: "📚",
    subjects: ["Mathematics", "Science", "English", "SST"],
  },
  {
    id: "10th",
    label: "10th Class",
    subtitle: "Board Exam Preparation",
    icon: "🎯",
    subjects: ["Mathematics", "Science", "English", "SST"],
  },
  {
    id: "11th JEE",
    label: "11th JEE",
    subtitle: "Engineering Entrance",
    icon: "⚡",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "11th NEET",
    label: "11th NEET",
    subtitle: "Medical Entrance",
    icon: "🔬",
    subjects: ["Physics", "Chemistry", "Biology"],
  },
  {
    id: "11th School PCM",
    label: "11th School PCM",
    subtitle: "Physics, Chemistry, Math",
    icon: "📐",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "11th School PCB",
    label: "11th School PCB",
    subtitle: "Physics, Chemistry, Bio",
    icon: "🌿",
    subjects: ["Physics", "Chemistry", "Biology"],
  },
];

const STATS = [
  { label: "Study Materials", value: "500+", icon: BookOpen },
  { label: "Active Students", value: "10K+", icon: Users },
  { label: "Batches Covered", value: "6", icon: Target },
  { label: "Success Rate", value: "94%", icon: Star },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface HomePageProps {
  onSelectBatch: (batch: string) => void;
}

export function HomePage({ onSelectBatch }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-gold" />
              <span className="text-white/80 text-xs font-medium tracking-wide">
                Premium coaching materials at affordable prices
              </span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-tight mb-5">
              Next Topper
              <span className="block text-gradient-gold">Mission</span>
            </h1>
            <p className="text-white/65 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
              Access premium study materials from PW, NextTopper &amp; Mission
              Jeet — all in one place. Top-quality content at a fraction of the
              cost.
            </p>
            <Button
              size="lg"
              className="gradient-gold text-foreground font-bold border-0 shadow-gold hover:opacity-90 gap-2"
              onClick={() =>
                document
                  .getElementById("batches")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Batches <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-white/10"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <div className="text-white font-display font-bold text-xl">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-navy py-12 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "📖",
                title: "Top Institute Materials",
                desc: "Content curated from PW, NextTopper & Mission Jeet",
              },
              {
                icon: "📱",
                title: "Any Device, Anytime",
                desc: "Access and download materials on mobile, tablet or PC",
              },
              {
                icon: "💰",
                title: "Affordable Access",
                desc: "Premium quality at a fraction of the coaching cost",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-3"
              >
                <div className="text-3xl" aria-hidden="true">
                  {f.icon}
                </div>
                <h4 className="font-display font-bold text-white text-lg">
                  {f.title}
                </h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Batch Cards */}
      <section id="batches" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
              Choose Your Batch
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Select your class or target exam to access all study materials,
              notes, and practice sets.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {BATCHES.map((batch, index) => (
              <motion.div key={batch.id} variants={itemVariants}>
                <div
                  data-ocid={`batch.item.${index + 1}`}
                  className="group relative bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-xs"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl" aria-hidden="true">
                        {batch.icon}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors mt-1" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-card-foreground mb-1">
                      {batch.label}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {batch.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {batch.subjects.map((sub) => (
                        <span
                          key={sub}
                          className="text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => onSelectBatch(batch.id)}
                      data-ocid={`batch.access_button.${index + 1}`}
                      className="w-full gradient-gold text-foreground font-semibold border-0 hover:opacity-90"
                    >
                      Access Materials
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
