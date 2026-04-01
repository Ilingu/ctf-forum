// components/LoadingSpinner.tsx
import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

export function LoadingSpinner({
  size = 20,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-gray-500 ${className}`}
      size={size}
      aria-hidden="true"
    />
  );
}
