import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/sohail-24",
    icon: <FaGithub className="h-4 w-4" />,
    hover: "hover:text-white",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/md-sohail2001",
    icon: <FaLinkedin className="h-4 w-4" />,
    hover: "hover:text-sky-400",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: <FaTwitter className="h-4 w-4" />,
    hover: "hover:text-sky-400",
  },
  {
    label: "Email",
    href: "mailto:mdsohail88008@gmail.com",
    icon: <FiMail className="h-4 w-4" />,
    hover: "hover:text-emerald-400",
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-transparent">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-10 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-lime-300/20 bg-lime-300/[0.05] font-mono text-[9px] font-bold text-lime-300"
          >
            {"</>"}
          </span>
          <span className="font-display text-[13px] font-bold text-white">
            sohail<span className="text-lime-300">devops</span>
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Signature line */}
        <p className="font-mono text-[11px] tracking-wide text-slate-500">
          Built with <span className="text-rose-400">❤</span>,{" "}
          <span className="text-amber-300">☕</span> and endless curiosity
        </p>

        {/* Social links */}
        <nav aria-label="Social links" className="flex items-center gap-1.5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={social.label}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-slate-400 transition-colors ${social.hover} hover:border-white/[0.14]`}
            >
              {social.icon}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
