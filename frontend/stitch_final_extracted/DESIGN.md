---
name: Zomato AI Design System
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#e5bdbe'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#ac8889'
  outline-variant: '#5c3f40'
  surface-tint: '#ffb3b6'
  primary: '#ffb3b6'
  on-primary: '#68001a'
  primary-container: '#e11d48'
  on-primary-container: '#fffaf9'
  inverse-primary: '#be0037'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#74d8bd'
  on-tertiary: '#00382d'
  tertiary-container: '#00836c'
  on-tertiary-container: '#eefff7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb3b6'
  on-primary-fixed: '#40000c'
  on-primary-fixed-variant: '#920028'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#90f5d9'
  tertiary-fixed-dim: '#74d8bd'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005142'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  button:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered to evoke a sense of futuristic intelligence and culinary luxury. It positions the product as a high-end concierge, moving away from the utility-only feel of traditional apps toward an immersive, AI-driven exploration of food.

The aesthetic is **Glassmorphism**, characterized by depth created through layered translucency, vibrant background blurs, and thin, high-fidelity strokes. The interface feels light despite its dark foundation, utilizing glowing accents and subtle animations to signal AI processing and personalized discovery. The target audience is the tech-savvy urban diner who values both convenience and a premium digital experience.

## Colors

The palette is anchored in a deep, nocturnal base to allow the "Zomato Red" and "AI Purple" to radiate.

- **Primary (Zomato Red):** Used for critical actions, brand identity, and as the leading color in interactive gradients.
- **Secondary (AI Purple):** Reserved for AI-specific states, such as voice input visualizers, recommendation "sparkles," and intelligent filtering indicators.
- **Surfaces:** All surfaces utilize a semi-transparent slate. Border colors on these surfaces should be a mix of the surface color and white at 10-15% opacity to simulate the edge of a glass pane.
- **Accents:** Use subtle glows (box-shadows with high blur and low opacity) in the secondary purple to denote "Smart" elements.

## Typography

This design system uses a dual-font strategy to balance character with readability. 

**Outfit** provides a geometric, modern energy for headings and interactive elements like buttons. Its wide stance and clean lines feel high-tech and premium. 

**Plus Jakarta Sans** is used for body copy and labels. Its soft, rounded terminals provide a friendly contrast to the sharp geometric headings, ensuring high legibility even in dense restaurant menus or review descriptions. All headlines should utilize a slight negative letter spacing to feel more cohesive and "editorial."

## Layout & Spacing

The layout follows a **fluid grid** model with a focus on generous whitespace to support the glassmorphism aesthetic. Overlapping elements (like a floating action button or a sticky AI search bar) should maintain a minimum of 24px clearance from edge boundaries.

- **Desktop:** 12-column grid with 24px gutters. Content is centered with a max-width of 1280px.
- **Mobile:** Single column with 16px side margins. 
- **Spacing Rhythm:** Use a strict 8px base unit. Component internal padding should favor larger values (e.g., 24px or 32px) to allow the glass background-blur to be visible and effective.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Tonal Layering** rather than traditional black shadows.

1.  **Level 0 (Base):** Deep Slate (#0f172a).
2.  **Level 1 (Cards/Lists):** Slate (#1e293b) at 70% opacity, Backdrop Blur: 16px, Border: 1px solid white (10% opacity).
3.  **Level 2 (Modals/Popovers):** Slate (#1e293b) at 85% opacity, Backdrop Blur: 24px, Border: 1px solid white (20% opacity). Use a subtle outer glow with the Primary color (10% opacity) for high-importance modals.
4.  **AI Elements:** Any element powered by AI should feature a 40px radius purple glow behind the card to create a "floating" effect.

## Shapes

The shape language is consistently **Rounded**. This softens the high-tech aesthetic, making it feel more approachable and culinary-focused. 

- **Cards:** Use `rounded-lg` (1rem).
- **Buttons & Inputs:** Use `rounded-lg` (1rem) for a modern, chunky feel.
- **Chips/Badges:** Use fully rounded (Pill-shaped) for tag-based navigation (e.g., "Italian", "Near Me").
- **Visual Dividers:** Use soft, 1px lines with a gradient fade out at both ends rather than solid blocks.

## Components

### Buttons
- **Primary:** Gradient background (Zomato Red to a slightly darker shade), white text, `rounded-lg`. On hover, add a subtle red outer glow.
- **AI Secondary:** Transparent background, purple border (2px), white text. On hover, fill with 10% purple opacity and add a background blur.

### Cards (Restaurant Items)
- **Style:** Glassmorphic background blur (16px), 1px semi-transparent border. 
- **Images:** Top-half rounded corners, brightness at 90% to ensure white text overlays are legible.

### Input Fields (Search)
- **Style:** Dark slate fill (80% opacity), `rounded-lg`, internal left-aligned search icon. 
- **AI State:** When the user types, the border should animate a gradient transition between Red and Purple.

### Chips & Filters
- **Style:** Pill-shaped, semi-transparent background. Active state uses a solid Primary Red fill with white text.

### AI Recommendations Feed
- **Style:** A distinct visual container with a "Glow" background effect. Use a subtle pulse animation on the border to indicate "Live AI Thinking."