# Arrow Button Component (LTR & RTL Support)

## HTML (SVG & Button Example)

```html
<!-- Example Button -->
<a href="#" class="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:gap-4">
  <span>Your Text Here</span>
  <svg class="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7v10"/>
  </svg>
</a>
```

## CSS (LTR & RTL Rules)

```css
/* Standard transition for the arrow */
.group-hover\:rotate-45 {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* LTR Hover: rotates up-right arrow (↗) to point straight UP (↑) */
.group:hover .group-hover\:rotate-45 {
  transform: rotate(45deg);
}

/* RTL Support */
/* 1. Flips arrow horizontally (↗ -> ↖) pointing outward to top-left */
html[dir="rtl"] .group-hover\:rotate-45 {
  transform: scaleX(-1);
}

/* 2. RTL Hover: rotates top-left arrow (↖) to point straight UP (↑) */
html[dir="rtl"] .group:hover .group-hover\:rotate-45 {
  transform: scaleX(-1) rotate(45deg);
}
```
