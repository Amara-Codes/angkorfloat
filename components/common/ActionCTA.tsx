import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { twMerge } from 'tailwind-merge';

interface ActionCTAProps {
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
  title: string;
  paragraph: string;
  buttonOneLabel: string;
  buttonOneLink: string;
  buttonOneVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  buttonTwoLabel?: string;
  buttonTwoLink?: string;
  buttonTwoVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  buttonOneIsExternal?: boolean;
  buttonTwoIsExternal?: boolean;
  className?: string; 
  titleClassName?: string;
  paragraphClassName?: string;
  titleColorClassName?: string;
  paragraphColorClassName?: string;
  containerClassName?: string;
}

const ActionCTA: React.FC<ActionCTAProps> = ({
  imageSrc,
  imageAlt = "",
  imagePosition = 'right',
  title,
  paragraph,
  buttonOneLabel,
  buttonOneLink,
  buttonOneVariant = 'outline',
  buttonTwoLabel,
  buttonTwoLink,
  buttonTwoVariant = 'secondary',
  buttonOneIsExternal = false,
  buttonTwoIsExternal = false,
  className = "",
  titleClassName = "text-5xl md:text-7xl font-kugile leading-tight italic",
  paragraphClassName = "text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line opacity-90",
  titleColorClassName = "text-custom-rosewood dark:text-custom-celadon",
  paragraphColorClassName = "text-custom-blue dark:text-custom-celadon",
  containerClassName = ""
}) => {
  const hasImage = !!imageSrc;

  return (
    <section className={twMerge(
        "flex w-full min-h-[50dvh] overflow-hidden transition-colors duration-500",
        hasImage ? "flex-col-reverse md:flex-row" : "flex-col md:flex-row justify-center items-center py-24",
        className
    )}>
      
      {/* Container Testo */}
      <div className={twMerge(
          "flex flex-col justify-center px-8 py-12 md:p-24 min-w-0",
          hasImage ? "w-full md:w-1/2" : "w-full max-w-5xl text-center items-center",
          hasImage && (imagePosition === 'right' ? 'md:order-first' : 'md:order-last'),
          containerClassName
      )}>
        <div className={twMerge(
            "space-y-8 w-full min-w-0",
            !hasImage && "flex flex-col items-center"
        )}>
          <h2 className={twMerge(
              "break-words",
              titleClassName,
              titleColorClassName
          )}>
            {title}
          </h2>
          
          <p className={twMerge(
              "break-words",
              paragraphClassName,
              paragraphColorClassName
          )}>
            {paragraph}
          </p>

          <div className={twMerge(
              "flex flex-wrap justify-center lg:justify-start gap-6 pt-4",
              !hasImage && "justify-center"
          )}>
            <Button
              variant={buttonOneVariant}
              size='lg'
              href={buttonOneLink}
              roundness='full'
              className='w-fit'
              isExternalLink={buttonOneIsExternal}
            >
              {buttonOneLabel}
            </Button>
            
            {buttonTwoLabel && buttonTwoLink && (
              <Button 
                variant={buttonTwoVariant}
                size='lg'
                href={buttonTwoLink}
                roundness='full'
                className='w-fit'
                isExternalLink={buttonTwoIsExternal}
              >
                {buttonTwoLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Container Immagine (Condizionale) */}
      {hasImage && (
        <div className="relative w-full md:w-1/2 h-[450px] md:h-auto">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

    </section>
  );
};

export default ActionCTA;