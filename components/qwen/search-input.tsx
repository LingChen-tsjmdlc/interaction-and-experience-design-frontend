"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Textarea, Card } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchInput({ className = "", onSearch }: SearchInputProps) {
  const [value, setValue] = useState("");
  const { t } = useTranslation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 从 i18n 获取占位文字动画的词汇
  const placeholderWords = t("search.placeholder", { returnObjects: true }) as string[];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // 占位文字打字机效果
  useEffect(() => {
    if (value) return;

    const currentWord = placeholderWords[currentWordIndex];

    if (isTyping) {
      if (displayedText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % placeholderWords.length);
          setIsTyping(true);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [displayedText, isTyping, currentWordIndex, value]);

  const handleSearch = useCallback(() => {
    if (value.trim() && onSearch) {
      onSearch(value.trim());
    }
  }, [value, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      handleSearch();
    }
  };

  // 固定5行高度
  useEffect(() => {
    if (textareaRef.current) {
      // 计算5行的固定高度
      const lineHeight = 24; // 每行约24px
      const padding = 32; // 上下 padding
      const fixedHeight = lineHeight * 5 + padding;
      textareaRef.current.style.height = `${fixedHeight}px`;
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 打字机占位文字 - 顶部左侧（放大镜旁边） */}
      <AnimatePresence>
        {!value && (
          <motion.div
            className="absolute left-15 top-2.5 z-10 pointer-events-none text-default-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>{displayedText}</span>
            <span className="animate-pulse">|</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 放大镜图标 - 左上角 */}
      <Icon
        icon="heroicons:magnifying-glass"
        className="absolute left-5 top-3 text-default-400 w-5 h-5 z-10 pointer-events-none"
      />

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onValueChange={setValue}
          onKeyDown={handleKeyDown}
          placeholder=" "
          variant="bordered"
          minRows={5}
          maxRows={10}
          radius="lg"
          isClearable={false}
          classNames={{
            base: "w-full",
            inputWrapper:
              "!pr-2 !py-2 !bg-white/60 dark:!bg-content2/60 !border-default-300 dark:!border-default-200/60 focus-within:!border-primary focus-within:!bg-white/70 dark:focus-within:!bg-content2/70",
            input: "text-base pr-0 py-0 pl-12 !bg-transparent",
          }}
          className="shadow-2xl shadow-primary/5 backdrop-blur-[30px]"
        />

        {/* 右下角操作按钮 */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {value && (
            <Button isIconOnly variant="light" size="sm" radius="full" onPress={() => setValue("")}>
              <Icon icon="mdi:close" className="w-4 h-4 text-default-400" />
            </Button>
          )}
          <Button
            isIconOnly
            className="rotate-45 hover:rotate-0 transition-all duration-300"
            color="primary"
            variant="flat"
            radius="full"
            disabled={!value.trim()}
            onPress={handleSearch}
          >
            <Icon icon="mdi:arrow-top-right" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
