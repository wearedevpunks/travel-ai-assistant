# Title Component

A flexible and reusable title component that supports various styling variants and custom HTML elements.

## Usage

```tsx
import { Title } from "@/components/atoms/Title"

// Basic usage with default variant (h3)
<Title>Default Title</Title>

// Specify a variant
<Title variant="h1">Page Title</Title>
<Title variant="h2">Section Title</Title>
<Title variant="h3">Subsection Title</Title>
<Title variant="h4">Small Title</Title>
<Title variant="h5">Highlight Title</Title>
<Title variant="card">Card Title</Title>

// Use a different HTML element than the default
<Title variant="h2" as="h1">SEO-friendly Title</Title>

// With additional custom className
<Title variant="h1" className="text-center text-primary">
  Custom Styled Title
</Title>
```

## Variants

- `h1`: Page title (text-2xl font-bold)
- `h2`: Section title (text-2xl font-bold)
- `h3`: Subsection title (text-xl font-semibold mb-4)
- `h4`: Card title (text-lg font-semibold)
- `h5`: Highlight title (font-medium text-gray-700)
- `card`: Card title semantic (font-semibold leading-none)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | TitleVariant | 'h3' | The styling variant to use |
| as | ElementType | depends on variant | The HTML element to render |
| children | ReactNode | - | The content of the title |
| className | string | - | Additional CSS classes to apply |