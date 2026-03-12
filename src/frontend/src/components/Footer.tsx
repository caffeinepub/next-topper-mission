import { GraduationCap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy-deep border-t border-white/5 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <span className="block text-white font-display font-bold text-sm leading-tight">
                Next Topper Mission
              </span>
              <span className="block text-white/40 text-xs">
                Premium Study Materials
              </span>
            </div>
          </div>
          <p className="text-white/30 text-xs">
            © {year}. Built with ❤️ using{" "}
            <a
              href={utm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-white/70 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-white/30 text-xs">Study smart. Top the exam.</p>
        </div>
      </div>
    </footer>
  );
}
