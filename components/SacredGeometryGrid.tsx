"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// --- TIPI ---
interface SacredElementProps {
  img: string;
  title?: string;
  subtitle?: string;
  // Props iniettate internamente dal Padre
  x?: number;
  y?: number;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
  id?: string;
  index?: number;
  auraClassName?: string;
  imageRingClassName?: string;
  cardTitleClassName?: string;
  cardSubtitleClassName?: string;
  energy?: number;
  karmaFactor?: number;
}

interface SacredGridProps {
  children: React.ReactNode;
  title: string;
  className?: string; // Sfondo del componente
  titleClassName?: string; // Colore del titolo principale
  linesClassName?: string; // Colore delle linee di connessione
  auraClassName?: string; // Colore delle auree pulsanti
  imageRingClassName?: string; // Colore dell'anello sull'immagine
  cardTitleClassName?: string; // Colore del titolo della card
  cardSubtitleClassName?: string; // Colore del sottotitolo della card
  energy?: number;      // 1-10: Velocità di orbita e pulsazione
  karmaFactor?: number; // 0-1: Controlla entropia/forma dell'onda
  karmaAlignment?: number; // 0-1: 1 = Poligono perfetto, 0 = Massima entropia posizionale
}

// --- COMPONENTE FIGLIO (SacredGeometryElement) ---
export const SacredGeometryElement: React.FC<SacredElementProps> = ({
  img,
  title,
  subtitle,
  x,
  y,
  isHovered,
  onHover,
  id,
  index = 0,
  auraClassName,
  imageRingClassName,
  cardTitleClassName,
  cardSubtitleClassName,
  energy = 5,
  karmaFactor = 1,
}) => {
  // Variazioni basate sull'index per rendere ogni elemento unico
  const baseDuration = 1.8 / (energy / 5);
  const myDuration = baseDuration + (index % 4) * 0.1; // Durata leggermente variabile
  const phaseShift = -(index * 0.35); // Varia il punto di partenza (valore 0) dell'animazione
  
  // Generazione array di bordi irregolari basati sull'indice
  const blobShapes = useMemo(() => {
    const shapeVariations = [
      "30% 70% 60% 40%",
      "70% 30% 40% 60%",
      "50% 60% 30% 70%",
      "40% 50% 70% 30%",
      "60% 40% 50% 50%"
    ];
    // Peschiamo 3 forme uniche per l'elemento in base all'indice per un ciclo lungo
    const s1 = shapeVariations[(index) % shapeVariations.length];
    const s2 = shapeVariations[(index + 1) % shapeVariations.length];
    const s3 = shapeVariations[(index + 2) % shapeVariations.length];
    
    const perfectCircle = "50% 50% 50% 50%";
    
    // Creiamo un ciclo continuo e fluido che ritorna sempre all'inizio senza scatti (A -> B -> C -> A)
    return {
      layer1: karmaFactor > 0.8 ? [perfectCircle, perfectCircle, perfectCircle] : [perfectCircle, s1, s2, perfectCircle],
      layer2: karmaFactor > 0.8 ? [perfectCircle, perfectCircle, perfectCircle] : [perfectCircle, s3, s1, perfectCircle]
    };
  }, [karmaFactor, index]);

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${isHovered ? 'z-40' : 'z-20'}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => onHover?.(id || null)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="relative group cursor-pointer w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
        
        {/* Aura Organica Fluida Continua */}
        <motion.div
          className={`absolute -inset-8 flex items-center justify-center pointer-events-none drop-shadow-[0_0_1rem_currentColor] transition-colors duration-500 ${auraClassName}`}
          initial={{ rotate: index * 45 }} // Rotazione iniziale sfasata
          animate={{ scale: isHovered ? 1.15 : 0.8, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
           {/* Layer Interno Fluido */}
           <motion.div
             className="absolute inset-0 blur-[2px]"
             animate={{ 
               borderRadius: blobShapes.layer1,
               boxShadow: ["inset 0px 0px 20px 8px currentColor", "inset 0px 0px 8px 2px currentColor", "inset 0px 0px 20px 8px currentColor"],
               rotate: [0, 180, 360],
               scale: [1, 1.05, 1]
             }}
             transition={{ duration: myDuration * 2.5, repeat: Infinity, ease: "easeInOut", delay: phaseShift }}
           />
           {/* Layer Esterno Fluido e Contro-rotante */}
           <motion.div
             className="absolute top-2 left-2 right-2 bottom-2 blur-[3px]"
             animate={{ 
               borderRadius: blobShapes.layer2,
               boxShadow: ["0px 0px 20px 8px currentColor", "0px 0px 8px 2px currentColor", "0px 0px 20px 8px currentColor"],
               rotate: [360, 180, 0],
               scale: [0.95, 1.02, 0.95]
             }}
             transition={{ duration: myDuration * 3, repeat: Infinity, ease: "easeInOut", delay: phaseShift }}
           />
        </motion.div>

        {/* Core Pulsante (visibile solo in hover) */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl bg-current"
            animate={{ opacity: [0, 0.3, 0], scale: [1, 1.4, 1] }}
            transition={{ duration: 2 / (energy / 5), repeat: Infinity }}
          />
        )}

        {/* Immagine Profilo */}
        <div 
          className={`absolute inset-0 rounded-full overflow-hidden ring-4 transition-all duration-700 shadow-2xl z-10
          ${isHovered ? `grayscale-0 scale-120 ${imageRingClassName}` : 'grayscale opacity-70 scale-100 ring-transparent'}`}
        >
          <Image src={img} alt={title || "Healer"} fill className="object-cover" />
        </div>

        {/* Tooltip Info */}
        <motion.div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-6 w-36 md:w-48 text-center pointer-events-none transition-colors duration-500 z-30`}
          initial={{ opacity: 0, y: 10 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        >
          {title && (
            <h4 className={`text-lg md:text-xl font-bold font-kugile uppercase tracking-tighter transition-colors duration-500 ${cardTitleClassName}`}>
              {title}
            </h4>
          )}
          {subtitle && (
            <p className={`text-sm md:text-lg italic font-josefin font-bold opacity-80 leading-tight mt-1 whitespace-pre-line transition-colors duration-500 ${cardSubtitleClassName}`}>
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// --- COMPONENTE PADRE (SacredGeometryGrid) ---
export const SacredGeometryGrid: React.FC<SacredGridProps> = ({
  children,
  title,
  className = "",
  titleClassName = "",
  linesClassName = "text-sky-300 dark:text-sky-500",
  auraClassName = "text-sky-300 dark:text-sky-500",
  imageRingClassName = "ring-sky-500 dark:ring-sky-300",
  cardTitleClassName = "text-sky-600 dark:text-sky-300",
  cardSubtitleClassName = "text-sky-500 dark:text-sky-400",
  energy = 5,
  karmaFactor = 1,
  karmaAlignment = 1,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Controllo iniziale
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const arrayChildren = React.Children.toArray(children);
  const totalElements = arrayChildren.length;

  // Calcolo dinamico della geometria basato sul numero di figli e dispositivo
  const nodes = useMemo(() => {
    const radius = 35; // Raggio del poligono (percentuale del container)
    const mobileLayout = mounted && isMobile;
    
    // Funzione pseudo-random deterministica basata sull'indice per evitare hydration mismatch
    const getDeterministicRandom = (index: number, seed: number) => {
      const x = Math.sin(index + seed) * 10000;
      return x - Math.floor(x);
    };

    return arrayChildren.map((_, i) => {
      if (mobileLayout) {
        // LAYOUT A SERPENTE (MOBILE)
        // Spaziatura verticale uniforme dal 5% al 95%
        const yBase = (i / Math.max(1, totalElements - 1)) * 90 + 5; 
        
        // Asse X a zig-zag: Alterna destra e sinistra
        const isLeft = i % 2 === 0;
        const xBase = 50 + (isLeft ? -15 : 15); // 35% o 65% per stare ben all'interno su mobile

        // Spostamento entropico basato su karmaAlignment (Deterministico)
        const randomness = (1 - karmaAlignment) * 10; // Ridotto a max 10% su mobile per evitare overflow
        const offsetX = (getDeterministicRandom(i, 0.1) - 0.5) * randomness;
        const offsetY = (getDeterministicRandom(i, 0.2) - 0.5) * randomness * 0.5; // Meno caos verticale per non sovrapporli

        return {
          x: Math.max(25, Math.min(75, xBase + offsetX)), // Clampa tra 25% e 75% su mobile per totale sicurezza
          y: Math.max(5, Math.min(95, yBase + offsetY)),
        };
      } else {
        // LAYOUT A POLIGONO (DESKTOP)
        // Distribuzione angolare uniforme
        const angle = (i / totalElements) * 2 * Math.PI - Math.PI / 2;
        
        // Calcolo Entropia basata su karmaAlignment (Deterministico)
        const randomness = (1 - karmaAlignment) * 15;
        const offsetX = (getDeterministicRandom(i, 0.3) - 0.5) * randomness;
        const offsetY = (getDeterministicRandom(i, 0.4) - 0.5) * randomness;

        return {
          x: 50 + radius * Math.cos(angle) + offsetX,
          y: 50 + radius * Math.sin(angle) + offsetY,
        };
      }
    });
  }, [totalElements, karmaAlignment, isMobile, mounted]);

  return (
    <section className={`relative py-24 w-full min-h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-500 ${className}`}>
      <h2 className={`text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-kugile mb-24 lg:mb-12 px-4 md:px-8 relative z-30 transition-colors duration-500 ${titleClassName}`}>
        {title}
      </h2>

      {/* Container della Geometria */}
      <div className="relative w-full h-[140vh] md:h-auto md:aspect-square mx-auto">
        
        {/* Layer SVG: Connessioni Tra Nodi */}
        {/* preserveAspectRatio="none" permette di deformare il viewBox sul container rettangolare in mobile senza rompere i calcoli */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 w-full h-full opacity-20 pointer-events-none transition-colors duration-500 ${linesClassName}`}>
          {nodes.map((node, i) => 
            // Su mobile leghiamo solo agli elementi successivi per creare il "serpente" ed evitare caos visivo.
            // Su desktop manteniamo la geometria completa interconnessa.
            nodes.slice(i + 1, (mounted && isMobile) ? i + 3 : undefined).map((target, j) => (
              <motion.line
                key={`line-${i}-${j}`}
                x1={node.x} y1={node.y}
                x2={target.x} y2={target.y}
                stroke="currentColor"
                strokeWidth={(mounted && isMobile) ? "1.5" : "0.15"}
                vectorEffect={(mounted && isMobile) ? "non-scaling-stroke" : undefined}
                strokeDasharray={(mounted && isMobile) ? "4 4" : "1 1"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))
          )}
        </svg>

        {/* Rendering dei Figli con Props iniettate */}
        <div className="absolute inset-0">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              const id = `sacred-node-${index}`;
              return React.cloneElement(child as React.ReactElement<any>, {
                x: nodes[index].x,
                y: nodes[index].y,
                id,
                index, // Passiamo l'indice al figlio
                isHovered: hoveredId === id,
                onHover: setHoveredId,
                auraClassName,
                imageRingClassName,
                cardTitleClassName,
                cardSubtitleClassName,
                energy,
                karmaFactor
              });
            }
            return child;
          })}
        </div>
      </div>
    </section>
  );
};