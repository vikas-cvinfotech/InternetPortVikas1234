/**
 * Tailwind CSS Configuration
 *
 * Palette Structure & Usage:
 * - primary (60% usage): Backgrounds and large surfaces.
 * - secondary (30% usage): Text and UI elements (icons, borders, footers).
 * - accent (10% usage): Buttons, links, and calls to action.
 * - divider (10% opacity of secondary): Divider stripes and borders.
 *
 * 60/30/10 Rule Guidance:
 * 1. Choose three core colors: primary, secondary, and accent (black/white count as colors).
 * 2. Apply the primary color to roughly 60% of your design (e.g., page backgrounds, cards).
 * 3. Use the secondary color for about 30% (e.g., text, icons, borders).
 * 4. Reserve the accent color for approximately 10% (e.g., buttons, links, badges).
 *
 * Note:
 * - The 60/30/10 rule is a guideline, not a strict prescription. Feel free to expand
 *   your palette beyond three colors, but maintain visual hierarchy by emphasizing the
 *   primary color and using secondary and accent colors for contrast and highlights.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '475px',
        xxl: '1400px',
        '3xl': '1700px',
        '4xl': '1920px',
        '5xl': '2200px',
      },
      colors: {
        // 60% usage: Background / Large surfaces
        primary: '#ffffff',
        // 30% usage: Text / UI elements (icons, borders, footers)
        secondary: '#1d1d1c',
        // 10% usage: Buttons / Links / CTAs
        accent: '#be1823',
        // Divider stripes and borders (10% opacity of secondary)
        divider: '#1d1d1C1A',
        // card color
        cardColor: '#454545',
        // 5% usage: Text / UI elements (paragraph)
        paraSecondary: '#4F4F4F',
        // Hover btn for accent background
        hoveraccent: '#9C1821',
        // lightaccent
        lightaccent: '#E1212E',
        // Header soical icon background
        surfaceSecondary: '#F6F6F6',
        // light gray
        secondaryBg: '#E7E7E7',
        // darkGray
        darkGray: '#1D1D1D',
        // border gray
        borderGray: '#E7E7E7',
        // mediumGray
        mediumGray: '#888888',
        // borderlightgray
        borderLightGray: '#D1D1D1',
        // herodivider
        dividerdark: '#B0B0B0',
        // bgblack
        darkblack: '#000000',
        // bgmediumdark
        mediumBlack: '#00000080',
        // lightgray
        mediumlightgray: '#F6F6F6',
        // lightbrown
        lightbrown: '#821A21',
        // darkbrown
        darkbrown: '#47080C',
        // lightergray
        lightergray: '#3D3D3D',
        // lightgreen
        lightgreen: '#8DC26D',
        // lightcream
        lightcream: '#FFE1E3',
        //lightPink
        lightpink: '#FC6D76',

        // --- NEW: Vibrant & Cohesive Semantic Colors ---
        // This set is designed to be vibrant and attention-grabbing while
        // maintaining a professional feel that complements the core palette.
        // Usage: `bg-success-light`, `text-success`, `text-success-dark`
        success: {
          light: '#f0fdf4', // Tailwind green-50
          DEFAULT: '#16a34a', // A vibrant, clear green for icons (green-600)
          dark: '#15803d', // A darker green for text (green-700)
        },
        failure: {
          light: '#fef2f2', // Tailwind red-50
          DEFAULT: '#dc2626', // A strong, standard failure red (red-600)
          dark: '#b91c1c', // A deeper red for text, matches original failure (red-700)
        },
        warning: {
          light: '#fff7ed', // Tailwind orange-50
          DEFAULT: '#f97316', // A bright, clear orange for icons (orange-500)
          dark: '#c2410c', // A deeper orange for text (orange-700)
        },
        info: {
          light: '#eff6ff', // Tailwind blue-50
          DEFAULT: '#2563eb', // A classic, vibrant UI blue for icons (blue-600)
          dark: '#1d4ed8', // A deeper blue for text (blue-700)
        },
      },
      boxShadow: {
        // shadow
        primaryShadow: '0px 6px 14px 0px #0000001A',
        secondaryShadow: '0px 2px 4px 0px #0000001F',
        darkShadow: '0px 16px 30px 0px #0000000D',
      },
      objectPosition: {
        'top-10': 'center -70px',
        'top-138': 'center -138px',
        'top-168': 'center -168px',
        'top-230': 'center -230px',
      },
      spacing: {
        // Add your custom 30px value here
        30: '30px',
        60: '60px',
      },
      fontFamily: {
        // Default sans-serif font
        sans: ['IBM_Plex_Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
