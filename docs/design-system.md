# TrustDrop design system

The visual language is Calendly-adjacent: white ground, deep navy ink, one vivid blue,
soft blue panels, pill controls. All four product surfaces (`/`, `/auth`, `/login`,
`/signup`, `/dashboard`) share it.

## Type

| Role | Face | Where |
| --- | --- | --- |
| Display | Manrope 600–800 | headings, prices, dashboard numerals |
| Text | Instrument Sans 400–600 | body, labels, form fields, buttons |
| Brand | Pacifico | wordmark in nav, auth masthead, footer |
| Accent | Dancing Script | the last word of the hero headline, "reviews" on auth |
| Annotation | Caveat | section kickers, trust-strip label, the note above the hero demo |
| Quotation | Great Vibes | review quote marks |

Script faces are accents only. None of them is used for body copy: below ~20px they
lose legibility and fail contrast, and they are never the only carrier of information.

## Colour

```
--ink        #0B3558   primary text, dark panels (auth form, CTA, footer)
--ink-soft   #24486B
--body       #476788   paragraph text
--muted      #6B7F94
--blue       #006BFF   primary action, links, accents
--blue-dark  #0052CC   hover
--blue-soft  #E8F1FF   tinted panels, icon tiles, badges
--line       #DCE7F5   1px borders
--green      #0E9F6E   success / verified only
```

Semantic use matters: green means verified or positive, never decoration. Warm hues
are not part of the palette.

## Geometry

- Controls (buttons, tabs, chips, app tiles): `border-radius: 999px`
- Panels and cards: `16–18px`; hero and large shells: `26px`
- Inputs and small tiles: `10–12px`
- Borders are 1px `--line`; resting shadow is `0 2px 10px rgba(11,53,88,.05)`

## Motion

Everything uses `--ease: cubic-bezier(.16,1,.3,1)`.

- Hero copy: staggered rise/fade, 0.9s
- Hero demo: 5.6s per step, auto-advancing, pauses on hover, respects reduced motion
- Section reveals: IntersectionObserver, 700ms, 80ms stagger
- Auth mode switch: `taSwap` (opacity + 14px slide + 0.97 scale), 420ms
- Hand-drawn underline: `stroke-dashoffset` draw, 1.1s

`prefers-reduced-motion` disables the demo timer, the underline draw, and rise
animations. Content is never hidden until an animation finishes.

## What is deliberately not installed

The stack is Next.js 16 + React 19 with inline scoped CSS and no Tailwind utility
classes, so these were evaluated and rejected for now:

- **shadcn/ui, Radix, Magic UI, Aceternity, React Bits** — would introduce a second
  styling system (Tailwind utilities + `components.json`) alongside the existing
  CSS-in-JSX, and duplicate primitives the app already has.
- **Motion, GSAP, AutoAnimate, React Three Fiber** — the interactions here are CSS
  keyframes and IntersectionObserver; nothing needs a JS animation engine, and R3F
  has no use in a dashboard product.
- **Playwright/axe in CI** — valuable, but adding a browser dependency to the Vercel
  build is a deployment risk worth deciding deliberately; run it locally first.

Revisit any of these when a concrete screen needs what they provide.
