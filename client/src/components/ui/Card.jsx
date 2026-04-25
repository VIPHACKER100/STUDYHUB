import * as React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-card border border-border shadow-md hover:shadow-xl",
    elevated: "bg-card border border-border shadow-lg hover:shadow-2xl hover:shadow-accent/10",
    featured: "relative p-[2px] rounded-2xl bg-gradient-to-br from-accent via-accent-secondary to-accent shadow-accent-lg",
  };

  if (variant === "featured") {
    return (
      <div className={cn(variants.featured, className)} ref={ref}>
        <div className="h-full w-full rounded-[calc(1rem-2px)] bg-card p-6 md:p-8" {...props} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export { Card };
