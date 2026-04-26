import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          muted: "hsl(var(--surface-muted))",
          raised: "hsl(var(--surface-raised))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          subtle: "hsl(var(--primary-subtle))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          subtle: "hsl(var(--secondary-subtle))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        status: {
          received: "hsl(var(--status-received))",
          receivedBg: "hsl(var(--status-received-bg))",
          inReview: "hsl(var(--status-in-review))",
          inReviewBg: "hsl(var(--status-in-review-bg))",
          forwarded: "hsl(var(--status-forwarded))",
          forwardedBg: "hsl(var(--status-forwarded-bg))",
          resolved: "hsl(var(--status-resolved))",
          resolvedBg: "hsl(var(--status-resolved-bg))",
          urgent: "hsl(var(--status-urgent))",
          urgentBg: "hsl(var(--status-urgent-bg))",
        },
        border: "hsl(var(--border))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 28px rgba(15, 23, 42, 0.08)",
        glow: "0 22px 50px rgba(14, 116, 144, 0.16)",
        control: "0 1px 2px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(14, 165, 233, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(240,249,255,0.9))",
      },
      fontFamily: {
        sans: ["Manrope", "Nunito Sans", "Avenir Next", "Segoe UI", "sans-serif"],
      },
      spacing: {
        "page-x": "1rem",
        section: "3rem",
        "section-lg": "5rem",
      },
    },
  },
  plugins: [],
};

export default config;
