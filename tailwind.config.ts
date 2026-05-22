import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                custom: {
                    blue: "#2A3038",
                    green: "#405B53",
                    celadon: "#c9dad7",
                    almond: "#eee0d1",
                    rosewood: "#8B4C55",
                    cinnamon: "#fea4d5",
                    mustard: "#fcc800",
                    cream: "#EEE0D1",
                    coconut: "#f6f3f0"
                    
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
            },
            fontFamily: {
                josefin: ["Josefin", "sans-serif"],
                kugile: ["Kugile", "sans-serif"],
                mocha: ["Mocha", "sans-serif"],
                moglan: ["Moglan", "sans-serif"],
                primor: ["Primor", "sans-serif"],
            },
            animation: {
                'bounce-right': 'bounce-right 1s infinite',
            },
            keyframes: {
                'bounce-right': {
                    '0%, 100%': {
                        transform: 'translateX(5px)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateX(0)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                }
            }
        },
    }
};

export default config;