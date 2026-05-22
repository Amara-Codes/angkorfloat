import React from 'react';
import Image from 'next/image';

interface Item {
  id: number | string;
  imageSrc: string;
  title: string;
  subtitle: string;
}

interface ItemsGridProps {
  title: string;
  items: Item[];
  className?: string; // Per passare il gradiente o classi custom
  imgClass?: string; // Per passare classi alle immagini
}

const DisplayGrid: React.FC<ItemsGridProps> = ({ 
  title, 
  items,
  className = "",
  imgClass = "object-contain invert contrast-200 scale-125"
}) => {
  return (
    <section className={`py-20 px-6 md:px-12 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Titolo Sezione */}
        <h2 className="text-center text-4xl md:text-5xl font-kugile text-custom-blue dark:text-custom-coconut mb-16 transition-colors duration-500">
          {title}
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group w-full min-w-0">
              {/* Icon Container */}
              <div className="w-full max-w-[200px] mx-auto relative h-48 mb-6 transition-transform duration-300">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className={imgClass}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Testi */}
              <h3 className="text-xl font-bold text-custom-blue dark:text-custom-coconut mb-2 uppercase tracking-wide break-words">
                {item.title}
              </h3>
              <p className="text-custom-blue dark:text-custom-coconut leading-relaxed max-w-[250px] whitespace-pre-line">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DisplayGrid;