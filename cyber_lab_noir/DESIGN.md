---
name: Cyber-Lab Noir
colors:
  surface: '#0e1224'
  surface-dim: '#0e1224'
  surface-bright: '#34384c'
  surface-container-lowest: '#090d1f'
  surface-container-low: '#161b2d'
  surface-container: '#1b1f31'
  surface-container-high: '#25293c'
  surface-container-highest: '#303447'
  on-surface: '#dee1fb'
  on-surface-variant: '#c8c5cc'
  inverse-surface: '#dee1fb'
  inverse-on-surface: '#2b2f43'
  outline: '#919096'
  outline-variant: '#47464c'
  surface-tint: '#c6c5d4'
  primary: '#c6c5d4'
  on-primary: '#2f303b'
  primary-container: '#1a1b26'
  on-primary-container: '#838391'
  inverse-primary: '#5d5d6a'
  secondary: '#4ad7f3'
  on-secondary: '#00363f'
  secondary-container: '#00b6d0'
  on-secondary-container: '#00424d'
  tertiary: '#f0be75'
  on-tertiary: '#442b00'
  tertiary-container: '#291800'
  on-tertiary-container: '#a77c3a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e1f1'
  primary-fixed-dim: '#c6c5d4'
  on-primary-fixed: '#1a1b26'
  on-primary-fixed-variant: '#454652'
  secondary-fixed: '#a6eeff'
  secondary-fixed-dim: '#4ad7f3'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5b'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#f0be75'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#0e1224'
  on-background: '#dee1fb'
  surface-variant: '#303447'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin: 32px
---

## Brand & Style

This design system evolves the aggressive Neo-Brutalism of its predecessor into a sophisticated, low-light environment designed for deep focus and technical precision. The brand personality is clinical yet atmospheric—evoking the feeling of a high-end research terminal operating in the late hours. 

The aesthetic is "Cyber-Lab Noir," combining the structural honesty of Brutalism (visible grids, thick strokes) with a refined, nocturnal color palette. It targets power users, developers, and researchers who require high visual clarity without the eye strain of high-frequency light. The emotional response is one of calm authority, reliability, and futuristic utility.

## Colors

The palette is anchored by **Midnight Blue (#1A1B26)**, providing a deep, stable foundation that minimizes glare. Surfaces use **Dark Grey/Blue (#24283B)** to create subtle contrast against the background without breaking the dark-mode immersion.

Accent colors are used sparingly for high-intent actions:
- **Soft Teal (#2AC3DE)**: Used for primary interactions, progress indicators, and successful states.
- **Muted Gold (#E0AF68)**: Reserved for critical warnings, highlights, or secondary calls to action that require warmth.
- **Silver/Off-white (#C0CAF5)**: Replaces pure white for all text to prevent "halation" effects on dark backgrounds, ensuring comfortable long-form reading.

## Typography

The design system utilizes **Space Grotesk** exclusively to maintain a technical, geometric rigour. The font’s idiosyncratic letterforms provide the necessary "Cyber-Lab" personality while remaining highly legible in dark mode.

- **Headlines**: Set with tight tracking and heavy weights to anchor the layout.
- **Body Text**: Uses a slightly increased line-height (1.6) to ensure the light-colored text doesn't bleed into the dark background.
- **Labels**: Often set in All-Caps with generous letter spacing to denote metadata or navigational categories, mimicking the look of technical schematics.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy built on an 8px rhythmic base. The layout is structured around a 12-column grid for desktop environments, utilizing rigid containers that emphasize the Brutalist roots.

Spacing is generous to allow the dark surfaces to "breathe," preventing the UI from feeling cramped or cluttered. Elements should be aligned to a strict baseline, and margins between major sections should use the `lg` (40px) or `xl` (64px) units to maintain clear visual separation. Elements do not float; they are anchored by structural borders and defined padding.

## Elevation & Depth

Depth is conveyed through a "Modern Brutalist" approach. Unlike traditional material design which uses diffused ambient light, this system uses **Hard-Edge Layering**:

1.  **Borders**: Every interactive element and container is defined by a 2px solid border (`#414868`). This replaces light-based shadows as the primary method of separation.
2.  **Shadows**: When shadows are used, they are "block shadows" offset by 4px or 8px. Instead of pitch black, these shadows use a semi-transparent Midnight Blue (`rgba(26, 27, 38, 0.5)`) to create a softer, more atmospheric lift that feels integrated into the dark environment.
3.  **Active States**: Elevation is signaled by a "pressed" effect—the block shadow disappears and the element shifts 2px or 4px on the X and Y axis, simulating a mechanical physical depress.

## Shapes

The shape language is strictly **Sharp (0px)**. All containers, buttons, and input fields utilize 90-degree corners to reinforce the industrial, lab-grade aesthetic. 

The only exception to the sharp rule is for specific status pips or data visualization points (e.g., circular status LEDs), but the structural containers holding them must remain rectangular. This lack of rounding maximizes the "Brutalist" impact and ensures the UI feels like a high-precision instrument.

## Components

- **Buttons**: Primary buttons use a Soft Teal background with Midnight Blue text. They feature a 4px offset block shadow. Secondary buttons use a transparent background with a 2px Teal border.
- **Input Fields**: Backgrounds are set to Midnight Blue (darker than the surface) with a constant Silver border. On focus, the border changes to Teal and the block shadow intensifies.
- **Cards**: Surface-colored blocks with a 2px border. Use "Label-Caps" typography for card headers to create a categorized, dossier-style look.
- **Chips/Tags**: Small, sharp-edged boxes with a 1px border. Use Muted Gold for "Warning" or "Active" tags to provide a warm focal point against the cool blue base.
- **Lists**: Separated by solid 1px horizontal lines. Hover states should trigger a subtle shift in background color to `#2F3549` rather than using a glow effect.
- **Data Readouts**: Use the `mono-data` typography style for numerical values, paired with small Teal accent bars to represent scale or progress.