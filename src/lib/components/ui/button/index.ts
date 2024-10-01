import { type VariantProps, tv } from "tailwind-variants";
import type { Button as ButtonPrimitive } from "bits-ui";
import Root from "./button.svelte";

const buttonVariants = tv({
    base: "ring-offset-background relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm " +
        "font-medium transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring " +
        "disabled:pointer-events-none disabled:opacity-50 ", //+
        // "after:content-[''] after:block after:absolute after:w-1.5 after:h-1.5 after:bg-background after:bottom-0 after:right-0 after:-mb-[1px] after:-mr-[1px] " +
        // "before:content-[''] before:block before:absolute before:w-1.5 before:h-1.5 before:bg-background before:top-0 before:left-0 before:-mt-[1px] before:-ml-[1px] " +
        // "[&>span::before]:content-[''] [&>span::before]:block [&>span::before]:absolute [&>span::before]:w-1.5 [&>span::before]:h-1.5 [&>span::before]:bg-background [&>span::before]:top-0 [&>span::before]:right-0 [&>span::before]:-mt-[1px] [&>span::before]:-mr-[1px] " +
        // "[&>span::after]:content-[''] [&>span::after]:block [&>span::after]:absolute [&>span::after]:w-1.5 [&>span::after]:h-1.5 [&>span::after]:bg-background [&>span::after]:bottom-0 [&>span::after]:left-0 [&>span::after]:-mb-[1px] [&>span::after]:-ml-[1px]",
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline:
                "border-input bg-background hover:bg-accent hover:text-accent-foreground border",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
