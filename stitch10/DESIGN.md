---
name: Emerald Orbit
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3f493f'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#006a63'
  on-secondary: '#ffffff'
  secondary-container: '#99efe5'
  on-secondary-container: '#006f67'
  tertiary: '#004cca'
  on-tertiary: '#ffffff'
  tertiary-container: '#2865ed'
  on-tertiary-container: '#f2f2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#9cf2e8'
  secondary-fixed-dim: '#80d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
  highlight-orange: '#F97316'
  bg-off-white: '#F8FAFC'
  surface-white: '#FFFFFF'
  gradient-start: '#15803D'
  gradient-end: '#0F766E'
  accent-gradient-end: '#0F766E'
typography:
  headline-display:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-uppercase:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  stats-number:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  card-padding: 24px
  stack-gap: 16px
---

## Brand & Style

This design system establishes a premium, B2B logistics identity that balances industrial reliability with high-velocity SaaS aesthetics. The brand personality is **efficient, authoritative, and forward-thinking**, moving away from traditional gritty logistics visuals toward a "Control Tower" experience.

The design style is **Corporate Modern with Glassmorphic accents**. It utilizes a clean, modular grid characterized by heavy whitespace, high-contrast typography, and a "layered" surface philosophy. Subtle gradients and vibrant accents are used sparingly to guide the user's eye toward critical data points and primary actions, ensuring the interface feels energetic yet stable.

## Colors

The palette is anchored by **Emerald Green**, symbolizing growth and successful transit, supported by **Deep Teal** for professional depth. **Royal Blue** is reserved for interactive elements and technical data, while **Warm Orange** serves as a high-visibility highlight for alerts, delays, or critical status updates.

**Gradients:**
- **Primary Flow:** Linear gradient (135deg) from Emerald Green (#15803D) to Deep Teal (#0F766E). Use for primary buttons and hero headers.
- **Action Flow:** Linear gradient (135deg) from Royal Blue (#2563EB) to Deep Teal (#0F766E). Use for secondary high-priority modules or navigation highlights.

The background uses a cool **Off-white** to reduce eye strain during long sessions, with **Surface White** used for cards to create a distinct physical lift.

## Typography

The typography strategy focuses on clarity and information hierarchy. **Sora** provides a geometric, modern tech feel for all headings and data visualizations (large numbers), emphasizing the "SaaS" nature of the platform. **Inter** handles all functional body text and labels, ensuring maximum readability for complex logistics data.

- **Display Headings:** Use sparingly for hero sections or landing pages.
- **Stats & Metrics:** Use the `stats-number` style for dashboard widgets to make key figures immediately scannable.
- **Labels:** Use the uppercase label style for table headers and small metadata categories.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is "Spacious Modularism," favoring generous margins and gutters to prevent information density from becoming overwhelming.

- **Horizontal Rhythm:** Standardized 24px gutters between all dashboard modules.
- **Vertical Rhythm:** 8px base unit. Gaps between related elements should be 16px (2 units), while gaps between unrelated sections should be 48px or 64px.
- **Responsive Behavior:** On mobile, all card modules stack vertically. Horizontal scrolling is permitted only for large data tables, which should include a "fade" indicator on the right edge.

## Elevation & Depth

Visual hierarchy is achieved through a **Tonal Layering** approach combined with **Ambient Shadows**.

- **Level 0 (Background):** Off-white (#F8FAFC) - the canvas.
- **Level 1 (Cards):** Surface White (#FFFFFF) with a soft, diffused shadow (0px 4px 20px rgba(31, 41, 55, 0.05)).
- **Level 2 (Interactive/Hover):** Surface White with an increased shadow spread (0px 10px 30px rgba(31, 41, 55, 0.10)) and a subtle 1px border in Emerald Green at 10% opacity.
- **Level 3 (Modals/Overlays):** High elevation with a backdrop blur (12px) on the layer beneath to maintain focus.

Avoid heavy black shadows; instead, use shadows tinted with the charcoal text color at very low opacities to keep the interface feeling light and airy.

## Shapes

The shape language is friendly and approachable, using **Rounded** corners to contrast the rigid nature of logistics.

- **Main Cards:** 24px border radius (custom `rounded-2xl` for this system).
- **Buttons & Inputs:** 12px border radius.
- **Chips/Status Tags:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.
- **Icons:** Should feature slightly rounded terminals and soft corners to match the UI components.

## Components

### Buttons
- **Primary:** Gradient background (Emerald to Teal), white text, 12px radius. Soft shadow on hover.
- **Secondary:** Transparent background, Emerald Green border (2px), Emerald Green text.
- **Ghost:** No border, Teal text, light teal background on hover.

### Cards
All modules must be housed in cards. Cards use a 24px border radius and 24px internal padding. For "Premium" features, apply a subtle 1px top-border gradient.

### Input Fields
Inputs use the Off-white background to recede into the page, with a Charcoal text color. On focus, the border transitions to Royal Blue with a 3px outer "glow" at 10% opacity.

### Chips & Status Indicators
- **In Transit:** Emerald Green (Light tint background, dark text).
- **Delayed:** Warm Orange (Light tint background, dark text).
- **Critical/Action Required:** Royal Blue (Light tint background, dark text).

### Navigation
Vertical side navigation using a Deep Teal background with a condensed Sora font for menu items. Active states should be marked with a vertical Emerald Green bar on the left edge of the menu item.