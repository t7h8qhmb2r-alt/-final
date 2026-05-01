---
name: Nightlab Neo-Brutalism
colors:
  surface: '#fcf8f9'
  surface-dim: '#dcd9da'
  surface-bright: '#fcf8f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f4'
  surface-container: '#f0edee'
  surface-container-high: '#eae7e8'
  surface-container-highest: '#e5e2e3'
  on-surface: '#1b1b1c'
  on-surface-variant: '#4a4731'
  inverse-surface: '#303031'
  inverse-on-surface: '#f3f0f1'
  outline: '#7b785f'
  outline-variant: '#ccc7aa'
  surface-tint: '#676000'
  primary: '#676000'
  on-primary: '#ffffff'
  primary-container: '#ffee00'
  on-primary-container: '#736b00'
  inverse-primary: '#d8ca00'
  secondary: '#ae2f34'
  on-secondary: '#ffffff'
  secondary-container: '#ff6b6b'
  on-secondary-container: '#6d0010'
  tertiary: '#006a65'
  on-tertiary: '#ffffff'
  tertiary-container: '#84fef4'
  on-tertiary-container: '#007670'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f7e600'
  primary-fixed-dim: '#d8ca00'
  on-primary-fixed: '#1f1c00'
  on-primary-fixed-variant: '#4e4800'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#8c1520'
  tertiary-fixed: '#7cf6ec'
  tertiary-fixed-dim: '#5dd9d0'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504c'
  background: '#fcf8f9'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e3'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  margin-page: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built for the high-energy "2nd bar" seeker—someone already out, fueled by adrenaline, looking for the next experiment in their night. The brand personality is **Electric, Scientific, and Irreverent**. It treats nightlife discovery like a high-stakes laboratory experiment, using a "Modern Laboratory" aesthetic filtered through a Neo-Brutalist lens.

The visual style is defined by intentional "loudness." It rejects the subtle gradients of modern SaaS for raw, high-contrast interfaces. Key characteristics include:
- **Maximum Contrast:** Every element is separated by thick, structural boundaries.
- **Experimental Energy:** A playful defiance of traditional UI "safety," using massive border radii and "hard" shadows.
- **The Lab Aesthetic:** Functional icons, data-heavy "specimen" cards, and technical-yet-fun typography that feels like a field guide to the city’s best drinks.

## Colors

The color palette is high-visibility and high-octane, designed to be legible in low-light bar environments while maintaining a "safety gear" aesthetic. 

- **Primary (#FFEE00):** Used for main CTAs, active states, and critical navigation. It acts as the "caution tape" of the app.
- **Secondary (#FF6B6B):** Reserved for "Danger" or high-heat selections, such as popular/crowded bars or "closing soon" alerts.
- **Accent (#4ECDC4):** Used for "Cooling" elements: availability of water, outdoor seating, or chill vibes.
- **Dark (#1A1A1B):** The structural ink. This is used for all borders, shadows, and primary typography to ground the vibrant colors.
- **Backgrounds:** Keep surfaces primarily white (#FFFFFF) or extremely light grey to ensure the neon-adjacent palette vibrates against the thick black strokes.

## Typography

This design system utilizes a "Technical-Chunky" typographic hierarchy. 

**Space Grotesk** serves as the display engine. Its geometric, slightly oddball construction reinforces the laboratory theme. Use it for headers, prices, and bar names. All display text should be high-weight (700+) to compete with the heavy 4px borders.

**Inter** provides the functional balance. It is used for descriptions, address details, and menu items to ensure the app remains usable even under the influence of the "2nd bar" environment. Maintain high line-height (1.5-1.6) for Inter to ensure readability against loud background colors.

## Layout & Spacing

This design system follows a rigid **8px grid system** with a 12-column fluid grid for mobile and tablet screens. 

- **The Thick-Margin Principle:** Elements should never feel "tight." Generous white space (or color-filled space) is required to offset the aggressive 4px borders. 
- **The Padded Box:** Every container uses a minimum of 24px internal padding. 
- **Rhythm:** Use "Stack" spacing for vertical lists. A `stack-lg` (32px) gap is preferred between different bar cards to allow their hard shadows room to breathe without overlapping adjacent borders.

## Elevation & Depth

In this design system, depth is not simulated with light—it is simulated with **structural offset**. 

- **Hard Shadows:** We reject soft blurs. All elevation is achieved via a solid black (#1A1A1B) shadow with 0px blur. 
- **The "Lift" Rule:** A standard elevated element (like a card or button) should have a 4px to 8px offset to the bottom-right.
- **Interaction Depth:** When a button is "pressed," the shadow should disappear (offset 0px) and the element should translate 4px down and to the right, mimicking a physical click into the page.
- **Floating Animation:** Use a constant, subtle floating animation (up/down 4px) for featured "Top Pick" cards to create a sense of high-energy kinetic movement.

## Shapes

The shape language is a "Juicy-Industrial" hybrid. 

- **Extreme Radii:** We use a `rounded-xl` (32px+) base for almost all containers. This softens the aggressive nature of the 4px black borders, making the app feel "fun" rather than "hostile."
- **Border Weight:** A consistent **4px solid black border** must be applied to all cards, buttons, and input fields.
- **The Pill Shape:** Buttons and Chips always use a full pill radius to maximize the playful, energetic vibe. 
- **Enclosures:** Use "The Specimen Jar" container style—a card with a 4px border and an 8px hard shadow—for all bar listings.

## Components

### Buttons & Interaction
- **Primary Button:** #FFEE00 background, 4px black border, 4px black hard shadow. Text in Space Grotesk Bold.
- **Secondary/Action Button:** #4ECDC4 or #FF6B6B background. 
- **Press State:** Upon tap, the button moves to (0,0) offset and the shadow is removed.

### Specimen Cards (Bar Listings)
- **Container:** White background, 32px rounded corners, 4px black border.
- **Header Section:** Bar name in Space Grotesk 24px, underlined with a 4px #FFEE00 stroke.
- **Badges:** Use Teal (#4ECDC4) chips for "Happy Hour" and Red (#FF6B6B) for "Near Capacity."

### Navigation (The Laboratory Bar)
- A floating bottom nav bar with a 4px black border and heavy 8px shadow.
- Active icons are encased in a #FFEE00 circle with a 4px border.

### Inputs (Search & Filters)
- **Search Field:** 4px black border, 32px radius. The placeholder text should be Inter 16px. 
- **Focus State:** The border color remains black, but the shadow offset doubles to 8px, making the field "pop" toward the user.

### Floating Laboratory HUD
- Smaller floating UI elements (like "Bars near you: 12") should have a subtle "bobbing" animation to keep the interface feeling alive and reactive.