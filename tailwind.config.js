/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate"
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', "sans-serif"],
            },
            screens: {
                "1.5xl": "1536px",
                "2xl": "1600px",
                "2.5xl": "1700px",
                "3xl": "1921px",
                xs: "480px",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius))",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
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
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                mine: "hsla(224, 79%, 19%, 1)",
            },
            boxShadow: {
                shadow: "0px 131px 37px 0px rgba(10, 30, 87, 0.00), 0px 84px 34px 0px rgba(10, 30, 87, 0.00), 0px 47px 28px 0px rgba(10, 30, 87, 0.02), 0px 21px 21px 0px rgba(10, 30, 87, 0.03), 0px 5px 12px 0px rgba(10, 30, 87, 0.03)",
                pagination_shadow: "0px 4px 12px 0px rgba(104, 97, 255, 0.40)",
            },
            keyframes: {
                "slide-in": {
                    from: {
                        transform: "translateX(50px)",
                        opacity: "0",
                    },
                    to: {
                        transform: "translateX(0)",
                        opacity: "1",
                    },
                },
                "slide-out": {
                    from: {
                        transform: "translateX(0)",
                        opacity: "1",
                    },
                    to: {
                        transform: "translateX(-50px)",
                        opacity: "0",
                    },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "slide-in": "slide-in 0.3s ease-out",
                "slide-out": "slide-out 0.3s ease-out",
            },
        },
    },
}

export const plugins = [tailwindcssAnimate]
