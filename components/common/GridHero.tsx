import React from 'react';
import Image from 'next/image';

interface GridHeroProps {
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  children: React.ReactNode;
}

const GridHero: React.FC<GridHeroProps> = ({
  imageSrc,
  imageAlt = 'GridHero image',
  imagePosition = 'left',
  children,
}) => {
  // Trasforma i children in un array per gestirli separatamente se necessario
  const childrenArray = React.Children.toArray(children);
  const hasImage = Boolean(imageSrc);

  return (
    <section className="flex flex-col md:flex-row w-full min-h-dvh overflow-hidden">
      {/* Container Immagine */}
      {hasImage && (
        <div
          className={`relative w-full min-h-[50dvh] md:min-h-0 md:w-1/2 shrink-0 ${
            imagePosition === 'right' ? 'md:order-last' : 'md:order-first'
          }`}
        >
          <Image
            src={imageSrc!}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Container Contenuto (Children) */}
      <div className={`flex flex-col w-full ${hasImage ? 'md:w-1/2' : ''} grow min-w-0`}>
        {childrenArray.map((child, index) => {
          if (React.isValidElement<{ className?: string }>(child)) {
            // Uniamo le classi base del layout (padding, flex, grow) con quelle passate dal child
            return React.cloneElement(child, {
              key: child.key || index,
              className: `flex flex-col justify-center px-8 py-12 md:px-12 md:py-16 grow min-w-0 ${
                child.props.className || ''
              }`
            });
          }
          return (
            <div
              key={index}
              className="flex flex-col justify-center px-8 py-12 md:px-12 md:py-16 grow min-w-0"
            >
              {child}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GridHero;