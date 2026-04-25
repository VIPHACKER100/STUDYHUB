import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = ({ className, children, animated = true, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2",
        className
      )}
      {...props}
    >
      <span 
        className={cn(
          "h-2 w-2 rounded-full bg-accent",
          animated && "animate-pulse-subtle"
        )} 
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent flex items-center gap-1.5">
        {children}
      </span>
    </div>
  );
};

export { Badge };
