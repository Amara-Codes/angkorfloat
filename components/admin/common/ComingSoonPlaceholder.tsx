import React from "react";
import { Wrench } from "lucide-react";

interface ComingSoonPlaceholderProps {
  title: string;
  description?: string;
}

export default function ComingSoonPlaceholder({ title, description = "We're working hard on this feature. It will be available very soon!" }: ComingSoonPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/50 dark:bg-custom-blue/50 border border-custom-blue/5 dark:border-white/5 rounded-3xl mt-8">
      <div className="h-24 w-24 rounded-3xl bg-custom-blue/5 dark:bg-white/5 flex items-center justify-center mb-6 text-custom-blue/30 dark:text-custom-celadon/30 animate-pulse">
        <Wrench className="h-12 w-12" />
      </div>
      <h2 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon mb-4">
        {title} <br className="hidden md:block" /> Coming Soon
      </h2>
      <p className="text-lg text-custom-blue/60 dark:text-custom-celadon/60 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
