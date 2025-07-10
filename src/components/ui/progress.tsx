
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  showDefaultIndicator?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, defaultValue, min = 0, max = 100, showDefaultIndicator = false, ...props }, ref) => {
  const percentage = value ? ((value - min) / (max - min)) * 100 : 0;
  const defaultPercentage = defaultValue ? ((defaultValue - min) / (max - min)) * 100 : 0;

  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-blue-600 transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
        
        {/* Indicateur de valeur par défaut - trait vertical rouge fin */}
        {showDefaultIndicator && defaultValue !== undefined && (
          <div
            className="absolute top-0 w-0.5 h-1 bg-red-500 z-10"
            style={{ left: `${defaultPercentage}%`, transform: 'translateX(-50%)' }}
          />
        )}
        
        {/* Petits points aux extrémités */}
        <div
          className="absolute top-1/2 w-1 h-1 bg-gray-500 rounded-full"
          style={{ left: '0%', transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="absolute top-1/2 w-1 h-1 bg-gray-500 rounded-full"
          style={{ left: '100%', transform: 'translate(-50%, -50%)' }}
        />
      </ProgressPrimitive.Root>
      
      {/* Labels en une seule ligne compacte */}
      {showDefaultIndicator && defaultValue !== undefined && (
        <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
          <span>Min: {min}{typeof min === 'number' && min < 10 ? '%' : min > 50 ? ' mois' : '%'}</span>
          <span className="font-medium text-red-500">Défaut: {defaultValue}{typeof defaultValue === 'number' && defaultValue < 10 ? '%' : defaultValue > 50 ? ' mois' : '%'}</span>
          <span>Max: {max}{typeof max === 'number' && max < 20 ? '%' : max > 50 ? ' mois' : '%'}</span>
        </div>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
