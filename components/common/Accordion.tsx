"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border border-custom-blue/5 dark:border-white/5 rounded-3xl bg-white/40 dark:bg-custom-blue/30 backdrop-blur-md shadow-xs hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full text-left px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-6 font-kugile text-xl sm:text-2xl text-custom-blue dark:text-custom-celadon hover:text-custom-rosewood dark:hover:text-custom-almond transition-colors duration-300 focus:outline-none cursor-pointer"
            >
              <span className="leading-snug">{item.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-custom-blue/40 dark:text-custom-celadon/50 shrink-0"
              >
                <ChevronDown className="h-6 w-6" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 border-t border-custom-blue/5 dark:border-white/5">
                    <p className="text-lg font-josefin font-bold leading-relaxed text-custom-blue/80 dark:text-custom-almond/80 whitespace-pre-wrap mt-4">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
