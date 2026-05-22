import { cn } from "@/lib/utils";
import LogoIcon from "../common/LogoIcon";

interface DynamicLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: {
    container: "gap-1.5",
    icon: "h-8 w-8",
    text: "text-lg md:text-xl",
  },
  md: {
    container: "gap-2",
    icon: "h-10 w-10",
    text: "text-xl md:text-2xl",
  },
  lg: {
    container: "gap-2.5",
    icon: "h-12 w-12",
    text: "text-2xl md:text-3xl",
  },
  xl: {
    container: "gap-3",
    icon: "h-14 w-14 md:h-16 md:w-16",
    text: "text-3xl md:text-4xl",
  },
  "2xl": {
    container: "gap-4",
    icon: "h-20 w-20 md:h-24 md:w-24",
    text: "text-4xl md:text-5xl lg:text-6xl",
  },
};

const DynamicLogo = ({ className, size = 'md' }: DynamicLogoProps) => {
  const currentSize = sizeClasses[size];

  return (
    <div className={cn("flex items-end", currentSize.container, className)}>
      <LogoIcon className={currentSize.icon} />
      <span className={cn("font-bold font-kugile leading-none", currentSize.text)}>Angkor Float</span>
    </div>
  );
};

export default DynamicLogo;