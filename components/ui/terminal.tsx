"use client";

// Adapted from Aceternity UI's "Terminal" (ui.aceternity.com/components/terminal)
// — a typewriter-animated terminal that plays through a scripted list of
// commands and their outputs. Extended with an optional `onComplete`
// callback so a consumer (e.g. a "boot sequence" before revealing real
// content) can react once the whole script has finished typing.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  prompt?: string;
  className?: string;
  onComplete?: () => void;
}

type CompletedCommand = { command: string; output: string[] };

export function Terminal({
  commands,
  outputs = {},
  typingSpeed = 50,
  delayBetweenCommands = 1000,
  prompt = "~",
  className,
  onComplete,
}: TerminalProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [completedCommands, setCompletedCommands] = useState<CompletedCommand[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (currentCommandIndex >= commands.length) {
      onCompleteRef.current?.();
      return;
    }

    const command = commands[currentCommandIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex === 0) setIsTyping(true);
      if (charIndex <= command.length) {
        setDisplayedText(command.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);

        setTimeout(() => {
          setCompletedCommands((prev) => [...prev, { command, output: outputs[currentCommandIndex] || [] }]);
          setCurrentCommandIndex((prev) => prev + 1);
        }, delayBetweenCommands);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCommandIndex]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [completedCommands, displayedText]);

  return (
    <div ref={containerRef} className={cn("overflow-y-auto p-4 font-mono text-sm", className)}>
      {completedCommands.map((item, i) => (
        <div key={i} className="mb-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="text-sky-400">{prompt}</span>
            <span>{item.command}</span>
          </div>
          {item.output.map((line, j) => (
            <div key={j} className="pl-4 text-neutral-400">
              {line}
            </div>
          ))}
        </div>
      ))}
      {currentCommandIndex < commands.length && (
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="text-sky-400">{prompt}</span>
          <span>{displayedText}</span>
          {isTyping && <span className="animate-pulse">▊</span>}
        </div>
      )}
    </div>
  );
}
