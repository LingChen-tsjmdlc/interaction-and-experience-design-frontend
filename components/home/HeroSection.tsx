"use client";

import { useTranslation } from "react-i18next";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Icon } from "@iconify/react";
import { useRef } from "react";
import { SearchInput } from "@/components/qwen/search-input";
import { QuickActions } from "@/components/qwen/quick-actions";
import { TextAnimate } from "@/components/magic-ui/TextAnimate";

/* ===== 流光边框内部组件 ===== */
function MovingBorder({
  children,
  duration = 2000,
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val) ?? 0);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val) ?? 0);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect fill="none" width="100%" height="100%" rx="50%" ry="50%" ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

export interface HeroSectionProps {
  /** 快捷按钮点击回调 */
  onQuickAction?: (actionId: string) => void;
}

export function HeroSection({ onQuickAction }: HeroSectionProps) {
  const { t } = useTranslation();

  const handleQuickAction = (actionId: string) => {
    onQuickAction?.(actionId);
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-4 overflow-hidden h-full">
      {/* 主视觉区域 */}
      <div className="w-full max-w-3xl mx-auto text-center mb-6">
        {/* 步骤1: Logo图标 - 淡入+缩放+旋转 (delay: 0) */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.2,
            rotate: -15,
            filter: "blur(20px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1.2,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="mb-5"
        >
          <Icon
            icon="logos:qwen-icon"
            className="mx-auto mt-16 h-[15vh] w-auto drop-shadow-lg hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </motion.div>

        {/* 步骤2: 标题 - 文字动画 (delay: 0.8s) */}
        <TextAnimate
          animation="scaleUp"
          by="text"
          as="h1"
          startOnView={false}
          delay={0.8}
          duration={0.4}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-foreground mb-3"
        >
          {t("hero.title")}
        </TextAnimate>

        {/* 步骤3: 副标题 - 文字动画 (delay: 1.4s) */}
        <TextAnimate
          key={t("hero.subtitle")}
          delay={1.4}
          as="p"
          className="text-base md:text-lg text-default-500 font-medium tracking-wide mb-4"
          variants={{
            hidden: {
              opacity: 0,
              y: 30,
              rotate: 45,
              scale: 0.5,
            },
            show: (i) => ({
              opacity: 1,
              y: 0,
              rotate: 0,
              scale: 1,
              transition: {
                delay: i * 0.1,
                duration: 0.4,
                y: {
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  mass: 0.8,
                },
                rotate: {
                  type: "spring",
                  damping: 8,
                  stiffness: 150,
                },
                scale: {
                  type: "spring",
                  damping: 10,
                  stiffness: 300,
                },
              },
            }),
            exit: (i) => ({
              opacity: 0,
              y: 30,
              rotate: 45,
              scale: 0.5,
              transition: {
                delay: i * 0.1,
                duration: 0.4,
              },
            }),
          }}
          by="character"
        >
          {t("hero.subtitle")}
        </TextAnimate>

        {/* 步骤4: 装饰线 - 横向展开 (delay: 2.0s) */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 2.0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full origin-center"
        />
      </div>

      {/* 步骤5: 输入框 - 明显淡入上浮+缩放 (delay: 2.6s) */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.85,
          filter: "blur(12px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1,
          delay: 2.6,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="w-full max-w-3xl mb-6"
      >
        <SearchInput className="w-full" />
      </motion.div>

      {/* 步骤6: 快捷按钮 - 逐个弹出现 (delay: 3.4s 起步) */}
      <div className="w-full max-w-3xl">
        <QuickActions onActionClick={handleQuickAction} baseDelay={3.4} />
      </div>

      {/* 步骤7: 开始体验按钮 (delay: 4.4s) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 4.4,
        }}
        className="mt-24"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* 流光边框按钮 */}
          <button
            onClick={scrollToNext}
            className="relative h-11 w-11 overflow-hidden bg-transparent text-xl cursor-pointer"
            style={{ borderRadius: "50%" }}
          >
            {/* 流光层 */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <MovingBorder duration={2000}>
                <div className="h-8 w-8 bg-[radial-gradient(#7c3aed_40%,transparent_60%)] opacity-90 dark:bg-[radial-gradient(#a78bfa_40%,transparent_60%)]" />
              </MovingBorder>
            </div>

            {/* 内容层 */}
            <div
              className="relative flex h-full w-full items-center justify-center border border-default-300 dark:border-default-200/60 bg-white/40 dark:bg-content2/40 text-default-600 backdrop-blur-sm"
              style={{ borderRadius: "50%" }}
            >
              <Icon icon="heroicons:chevron-down" className="w-5 h-5" />
            </div>
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
