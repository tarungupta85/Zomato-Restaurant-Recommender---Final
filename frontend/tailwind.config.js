/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#5516be",
        "surface-container-low": "#0d1c2d",
        "on-primary-fixed": "#40000c",
        "surface-container-high": "#1c2b3c",
        "on-surface": "#d4e4fa",
        "secondary-fixed": "#e9ddff",
        "on-secondary-container": "#c4abff",
        "surface-bright": "#2c3a4c",
        "error": "#ffb4ab",
        "tertiary-container": "#00836c",
        "on-error-container": "#ffdad6",
        "on-background": "#d4e4fa",
        "error-container": "#93000a",
        "surface-dim": "#0f172a",
        "secondary-fixed-dim": "#d0bcff",
        "on-secondary-fixed": "#23005c",
        "on-tertiary-container": "#eefff7",
        "surface-container-highest": "#1e293b",
        "primary-container": "#e11d48",
        "primary": "#ffb3b6",
        "inverse-primary": "#be0037",
        "surface-variant": "#334155",
        "on-error": "#690005",
        "surface-container": "#0f172a",
        "on-surface-variant": "#94a3b8",
        "inverse-on-surface": "#f1f5f9",
        "on-secondary": "#3c0091",
        "secondary": "#a855f7",
        "surface-tint": "#e11d48",
        "primary-fixed-dim": "#ffb3b6",
        "outline": "#475569",
        "on-tertiary": "#00382d",
        "primary-fixed": "#ffdada",
        "background": "#0f172a",
        "outline-variant": "#334155",
        "on-primary-container": "#fffaf9",
        "inverse-surface": "#d4e4fa",
        "on-primary-fixed-variant": "#920028",
        "tertiary-fixed": "#90f5d9",
        "tertiary": "#74d8bd",
        "surface-container-lowest": "#020617",
        "on-primary": "#68001a",
        "surface": "#0f172a",
        "tertiary-fixed-dim": "#74d8bd",
        "secondary-container": "#7e22ce",
        "on-tertiary-fixed-variant": "#005142",
        "on-tertiary-fixed": "#002019"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-mobile": "16px",
        "unit": "8px",
        "gutter": "24px",
        "margin-desktop": "48px",
        "container-max-width": "1280px"
      },
      fontFamily: {
        "label-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Outfit", "sans-serif"],
        "headline-lg": ["Outfit", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "button": ["Outfit", "sans-serif"],
        "headline-lg-mobile": ["Outfit", "sans-serif"],
        "headline-xl": ["Outfit", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "button": ["16px", { "lineHeight": "24px", "fontWeight": "600" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "fontWeight": "600" }],
        "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "spin-reverse-slow": "spin-reverse 12s linear infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 2s linear infinite"
      },
      keyframes: {
        "spin-reverse": {
          "from": { transform: "rotate(360deg)" },
          "to": { transform: "rotate(0deg)" }
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "slide-in-right": {
          "0%": { opacity: 0, transform: "translateX(30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
