"use client";
import React, { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const CometCard = ({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // 参考 MagicCard 的主题检测方式
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // 避免服务端渲染不匹配：默认暗色（与项目默认一致），挂载后切换
  const isDark = useMemo(() => {
    if (!mounted) return true;
    const current = theme === "system" ? systemTheme : theme;
    return current === "dark";
  }, [theme, systemTheme, mounted]);

  React.useEffect(() => setMounted(true), []);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  // 暗色模式：白色聚光灯 — 用极细密的停靠点 + 极微蓝调消除层纹（纯白在暗底上每级跳变都会形成可见环）
  const glareBgLight = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(250, 250, 255, 0.92) 0%, rgba(249, 249, 255, 0.88) 4%, rgba(248, 248, 255, 0.82) 9%, rgba(247, 247, 255, 0.74) 14%, rgba(246, 246, 255, 0.64) 20%, rgba(245, 245, 255, 0.53) 27%, rgba(244, 244, 254, 0.42) 34%, rgba(242, 242, 254, 0.32) 42%, rgba(240, 240, 254, 0.22) 52%, rgba(236, 236, 252, 0.14) 63%, rgba(230, 230, 250, 0.08) 75%, transparent 100%)`;

  // 亮色模式：深色聚光灯，multiply 深色打亮底=自然的阴影深度感（参考 MagicCard 的 orb 模式思路）
  const glareBgDark = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(80, 80, 100, 0.25) 0%, rgba(60, 60, 80, 0.2) 15%, rgba(40, 40, 60, 0.12) 35%, rgba(30, 30, 50, 0.05) 55%, transparent 70%)`;

  // 根据主题选择聚光灯样式
  const glareBackground = isDark ? glareBgLight : glareBgDark;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn("perspective-distant transform-3d", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          boxShadow:
            "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={{
          scale: 1.05,
          z: 50,
          transition: { duration: 0.2 },
        }}
        className="relative rounded-2xl overflow-hidden"
      >
        {children}
        {/* 聚光灯覆盖层 — 参考 MagicCard 的双模式策略 */}
        <motion.div
          suppressHydrationWarning
          className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px]"
          style={{
            background: glareBackground,
            // 暗色模式：overlay 白光提亮；亮色模式：multiply 深色调产生自然阴影
            mixBlendMode: isDark ? ("overlay" as const) : ("multiply" as const),
            opacity: isDark ? 0.55 : 1,
            backdropFilter: "blur(0.5px)",
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
};
