import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/Button";

interface TabHeadingProps {
  title: string;
  subtitle?: string;
  buttonHref?: string;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  showButton?: boolean;
}

export default function TabHeading({
  title,
  subtitle,
  buttonHref,
  buttonLabel,
  buttonIcon = <Plus className="h-5 w-5" />,
  showButton = true,
}: TabHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
      <div className="space-y-2">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-kugile text-custom-blue dark:text-custom-celadon tracking-tight leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-custom-blue/60 dark:text-custom-celadon/60 font-medium max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {showButton && buttonHref && buttonLabel && (
        <Button
          href={buttonHref}
          variant="celadon"
          size="md"
          roundness="xl"
          icon={buttonIcon}
          className="shrink-0 sm:self-center self-start shadow-md hover:shadow-lg transition-all"
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
