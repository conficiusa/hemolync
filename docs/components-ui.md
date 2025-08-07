## Components (UI)

Source: `src/components/ui/*`

### Button
Source: `src/components/ui/button.tsx`

Exports: `Button`, `buttonVariants`
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="icon" aria-label="Close">✕</Button>
```

### Input
Source: `src/components/ui/input.tsx`
```tsx
import { Input } from '@/components/ui/input'
<Input placeholder="Email" type="email" />
```

### Textarea
Source: `src/components/ui/textarea.tsx`
```tsx
import { Textarea } from '@/components/ui/textarea'
<Textarea placeholder="Notes" rows={4} />
```

### Tabs
Source: `src/components/ui/tabs.tsx`
Exports: `Tabs, TabsList, TabsTrigger, TabsContent`
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
<Tabs defaultValue="one">
  <TabsList>
    <TabsTrigger value="one">One</TabsTrigger>
    <TabsTrigger value="two">Two</TabsTrigger>
  </TabsList>
  <TabsContent value="one">Panel 1</TabsContent>
  <TabsContent value="two">Panel 2</TabsContent>
</Tabs>
```

### Other UI exports
Also available and follow standard Radix-style props:
- `Accordion, AccordionItem, AccordionTrigger, AccordionContent`
- `Alert, AlertTitle, AlertDescription`
- `AspectRatio`
- `Avatar, AvatarImage, AvatarFallback`
- `Badge`
- `Calendar, CalendarDayButton`
- `Checkbox`
- `Collapsible, CollapsibleTrigger, CollapsibleContent`
- `HoverCard, HoverCardTrigger, HoverCardContent`
- `InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator`
- `Label`
- `Popover, PopoverTrigger, PopoverContent, PopoverAnchor`
- `Progress`
- `RadioGroup, RadioGroupItem`
- `ScrollArea, ScrollBar`
- `Separator`
- `Slider`
- `Sonner` toaster provider (`Toaster`)
- `Switch`
- `Toggle, toggleVariants`
- `ToggleGroup, ToggleGroupItem`
- `Tooltip, TooltipTrigger, TooltipContent, TooltipProvider`

For details, check each file under `src/components/ui/`.