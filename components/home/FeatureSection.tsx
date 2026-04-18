"use client";

import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import React, { useRef, useState, useMemo, forwardRef } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { CometCard as CometCardLightMode } from "@/components/aceternity-ui/CometCardLiaghtMode";
import { CometCard as CometCardDarkMode } from "@/components/aceternity-ui/CometCardeDarkMode";
import SplitText from "@/components/reactbits-ui/SplitText";

// ====== 功能展示组件导入 ======
import { ImagesBadge } from "@/components/aceternity-ui/ImagesBadge";
import { AnimatedList } from "@/components/magic-ui/AnimatedList";
import { Compare } from "@/components/aceternity-ui/Compare";
import { Terminal } from "@/components/aceternity-ui/Terminal";
import { AnimatedBeam } from "@/components/magic-ui/AnimatedBeam";
import { Tree, type TreeViewElement } from "@/components/magic-ui/FileTree";

/** 功能项定义 */
const FEATURE_KEYS = [
  "imageGen",
  "deepResearch",
  "webDev",
  "deepThink",
  "search",
  "multimodal",
] as const;

/** 深入研究通知项图标（emoji 不需要翻译） */
const RESEARCH_ICONS = ["📄", "📊", "💡", "🔬", "📈", "🎯", "👤", "🚀"];
const RESEARCH_COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

// ====== 圆形图标节点（AnimatedBeam 用） ======
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`z-10 flex items-center justify-center rounded-full border bg-white p-2.5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] ${className || ""}`}
        style={{ width: 48, height: 48 }}
      >
        {children}
      </div>
    );
  },
);
Circle.displayName = "Circle";

// ====== 深入研究：通知卡片组件 ======
interface NotificationItem {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

function ResearchNotification({ name, description, icon, color, time }: NotificationItem) {
  return (
    <figure className="relative mx-auto min-h-fit w-full max-w-[340px] cursor-pointer overflow-hidden rounded-2xl p-3 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]">
      <div className="flex flex-row items-center gap-2.5">
        <div
          className="flex size-9 items-center justify-center rounded-xl text-sm"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-sm font-medium whitespace-pre dark:text-white">
            <span>{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-neutral-400">{time}</span>
          </figcaption>
          <p className="text-xs font-normal dark:text-white/60">{description}</p>
        </div>
      </div>
    </figure>
  );
}

// ====== 单个功能介绍行 ======
type FeatureKey = (typeof FEATURE_KEYS)[number];

interface FeatureRowProps {
  featureKey: FeatureKey;
  index: number;
}

function FeatureRow(props: FeatureRowProps) {
  const { featureKey, index } = props;
  const { t, i18n } = useTranslation();
  const isReversed = index % 2 === 1;
  const rowRef = useRef<HTMLDivElement>(null);
  // 关键：once=false，每次进入视口都会触发，用于驱动动画重播
  const isInView = useInView(rowRef, { margin: "-120px", once: false });

  // Theme detection
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = useMemo(() => {
    if (!mounted) {
      return true;
    }
    return (theme === "system" ? systemTheme : theme) === "dark";
  }, [theme, systemTheme, mounted]);
  React.useEffect(() => setMounted(true), []);

  const CurrentCometCard = isDark ? CometCardDarkMode : CometCardLightMode;

  // Language switch force re-render SplitText
  const titleText = t(`features.${featureKey}.title`);
  const descText = t(`features.${featureKey}.description`);

  // ====== 动画重播机制：isInView 从 false→true 时递增 cycle，强制子组件重新挂载 ======
  const prevInViewRef = useRef(false);
  const [animCycle, setAnimCycle] = useState(0);

  if (isInView && !prevInViewRef.current) {
    prevInViewRef.current = true;
    setAnimCycle((c) => c + 1);
  } else if (!isInView) {
    prevInViewRef.current = false;
  }

  // ====== i18n 动态数据生成 ======

  // 深入研究通知列表（从 i18n 生成）
  const researchNotifications: NotificationItem[] = useMemo(() => {
    try {
      const names: string[] = t("features.deepResearch.demo.names", {
        returnObjects: true,
      }) as unknown as string[];
      const times: string[] = t("features.deepResearch.demo.times", {
        returnObjects: true,
      }) as unknown as string[];
      const desc = t("features.deepResearch.demo.description");
      // Fallback to defaults if translation returns raw key
      const fallbackNames = [
        "学术论文",
        "技术报告",
        "专利文献",
        "行业分析",
        "市场研究",
        "竞品调研",
        "用户画像",
        "趋势预测",
      ];
      const fallbackTimes = ["2m ago", "3m ago", "5m ago", "刚刚"];
      const resolvedNames = Array.isArray(names) && names.length > 0 ? names : fallbackNames;
      const resolvedTimes = Array.isArray(times) && times.length > 0 ? times : fallbackTimes;

      return Array.from({ length: 8 }, (_, i) => ({
        name: resolvedNames[i % resolvedNames.length],
        description: desc || "Qwen · Deep Research",
        time: resolvedTimes[i % resolvedTimes.length],
        icon: RESEARCH_ICONS[i % 8],
        color: RESEARCH_COLORS[i % 8],
      }));
    } catch {
      return [];
    }
  }, [t, i18n.language]);

  // 深度思考终端数据（从 i18n 生成）
  const terminalData = useMemo(() => {
    try {
      const commands: string[] = t("features.deepThink.demo.commands", {
        returnObjects: true,
      }) as unknown as string[];
      const outputsRaw = t("features.deepThink.demo.outputs", {
        returnObjects: true,
      }) as unknown as Record<string, string[]>;
      const username = t("features.deepThink.demo.username") || "DeepThink";

      const fallbackCommands = [
        "analyze project requirements...",
        "explore solution space -> 1024 possibilities",
        "evaluate trade-offs: performance vs complexity",
        "synthesize optimal architecture design ✨",
      ];
      const fallbackOutputs: Record<number, string[]> = {
        0: [
          "✔ Analyzing 47 requirement documents",
          "✔ Identified 12 core constraints",
          "✔ Mapped dependency graph (89 nodes)",
        ],
        1: ["⚡ Generated 1024 candidate solutions"],
        2: [
          "✓ Scored by: feasibility(0.35), scalability(0.30)",
          "✓ Cost efficiency(0.25), maintainability(0.10)",
        ],
        3: ["★ Recommended: Microservices + Event-Driven"],
      };

      const resolvedCmds =
        Array.isArray(commands) && commands.length > 0 ? commands : fallbackCommands;
      // Convert string-keyed outputs to number-keyed
      const resolvedOutputs: Record<number, string[]> = {};
      if (outputsRaw && typeof outputsRaw === "object") {
        Object.entries(outputsRaw).forEach(([k, v]) => {
          resolvedOutputs[Number(k)] = v;
        });
      }

      return {
        commands: resolvedCmds,
        outputs: Object.keys(resolvedOutputs).length > 0 ? resolvedOutputs : fallbackOutputs,
        username,
      };
    } catch {
      return null;
    }
  }, [t, i18n.language]);

  // 多模态文件树数据（从 i18n 生成）
  const multimodalTreeData: TreeViewElement[] = useMemo(() => {
    try {
      const rootName = t("features.multimodal.demo.rootName") || "📦 multimodal-inputs";
      const folders: { id: string; name: string; files: string[] }[] = t(
        "features.multimodal.demo.folders",
        { returnObjects: true },
      ) as unknown as { id: string; name: string; files: string[] }[];

      const fallbackFolders = [
        { id: "text", name: "📝 Text", files: ["paper.pdf", "report.mdx", "code.py"] },
        { id: "image", name: "🖼️ Image", files: ["photo.jpg", "chart.png", "scan.tif"] },
        { id: "audio", name: "🎵 Audio", files: ["meeting.mp3", "podcast.m4a", "voice.wav"] },
        { id: "video", name: "🎬 Video", files: ["demo.mp4", "tutorial.webm", "live.flv"] },
      ];

      const resolvedFolders =
        Array.isArray(folders) && folders.length > 0 ? folders : fallbackFolders;

      return [
        {
          id: "multimodal",
          type: "folder",
          isSelectable: true,
          name: rootName,
          children: resolvedFolders.map((folder) => ({
            id: folder.id,
            type: "folder" as const,
            isSelectable: true,
            name: folder.name,
            children: folder.files.map((file, fi) => ({
              id: `${folder.id}-file-${fi}`,
              isSelectable: true,
              name: file,
            })),
          })),
        },
      ];
    } catch {
      return [];
    }
  }, [t, i18n.language]);

  // Render demo content based on feature key
  const renderFeatureContent = () => {
    switch (featureKey) {
      case "imageGen":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <ImagesBadge
              text=""
              images={[
                "https://uapis.cn/api/v1/random/image?category=landscape",
                "https://uapis.cn/api/v1/random/image?category=acg&type=pc",
                "https://uapis.cn/api/v1/random/image?category=acg",
              ]}
              folderSize={{ width: 48, height: 36 }}
              teaserImageSize={{ width: 40, height: 28 }}
              hoverImageSize={{ width: 140, height: 108 }}
              hoverTranslateY={-110}
              hoverSpread={50}
            />
          </div>
        );

      case "deepResearch":
        // animCycle 变化时 key 变化 → 强制重新挂载 AnimatedList → 动画重播
        return (
          <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-1">
            <div className="relative flex h-full w-full max-w-[360px] flex-col overflow-hidden py-2">
              <AnimatedList delay={2500} key={`research-anim-${animCycle}`}>
                {researchNotifications.map((item, idx) => (
                  <ResearchNotification key={`${animCycle}-${idx}`} {...item} />
                ))}
              </AnimatedList>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-zinc-900 dark:via-zinc-900/60" />
            </div>
          </div>
        );

      case "webDev":
        return (
          <div className="w-full h-full overflow-hidden rounded-2xl">
            <Compare
              firstImage="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
              secondImage="https://assets.aceternity.com/linear-dark.png"
              firstImageClassName="object-cover object-left-top w-full"
              secondImageClassname="object-cover object-left-top w-full"
              className="w-full h-full rounded-2xl md:rounded-lg"
              slideMode="hover"
              autoplay={true}
            />
          </div>
        );

      case "deepThink":
        // animCycle 变化时 key 变化 → 强制重新挂载 Terminal → 打字机动画重播
        if (!terminalData) {
          return null;
        }
        return (
          <div className="flex items-center justify-center w-full h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <Terminal
              {...terminalData}
              typingSpeed={40}
              delayBetweenCommands={1200}
              enableSound={false}
              className="!max-w-md scale-90 origin-center"
              key={`think-anim-${animCycle}`}
            />
          </div>
        );

      case "search":
        return <SearchDemo />;

      case "multimodal":
        return (
          <div className="bg-background relative flex h-full w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-lg border border-border mx-auto my-2">
            <Tree
              className="overflow-hidden rounded-md p-2 bg-transparent"
              initialSelectedId="text-file-0"
              initialExpandedItems={["multimodal", "text", "image"]}
              elements={multimodalTreeData}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={rowRef}
      className={`flex flex-col ${
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-8 lg:gap-16`}
    >
      {/* Card area */}
      <motion.div
        className="w-full lg:flex-1"
        animate={
          isInView
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: isReversed ? 40 : -40, scale: 0.92 }
        }
        transition={{
          duration: 0.7,
          delay: isInView ? 0.05 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <CurrentCometCard rotateDepth={12} translateDepth={10} className="w-full">
          <div className="flex items-center justify-center w-full h-[240px] md:h-[280px] rounded-2xl bg-white dark:bg-zinc-950 overflow-visible">
            {renderFeatureContent()}
          </div>
        </CurrentCometCard>
      </motion.div>

      {/* Text content */}
      <div className="lg:flex-1 lg:max-w-[45%] w-full space-y-3 break-words">
        {/* Title */}
        <motion.h3
          key={`${i18n.language}-${featureKey}-title`}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -30, scale: 0.5 }}
          transition={{
            duration: 0.6,
            delay: isInView ? 0.2 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-xl md:text-2xl font-bold text-foreground tracking-tight"
        >
          {titleText}
        </motion.h3>

        {/* Description */}
        <motion.div
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{
            duration: 0.4,
            delay: isInView ? 0.25 : 0,
          }}
          className="w-full overflow-hidden"
        >
          <SplitTextWithReplay
            text={descText}
            tag="p"
            className="text-sm md:text-base text-default-500 leading-relaxed"
            splitType="chars"
            delay={20}
            duration={0.6}
            ease="power2.out"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-80px"
            textAlign="left"
            triggerId={`${i18n.language}-${featureKey}-desc`}
            shouldPlay={isInView}
          />
        </motion.div>

        {/* Timestamp */}
        <motion.div
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{
            duration: 0.4,
            delay: isInView ? 0.5 : 0,
          }}
          className="pt-1 text-xs text-default-400 font-medium tracking-wide"
        >
          2025/03/28 · 产品
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Re-playable SplitText wrapper component
 */
function SplitTextWithReplay(
  props: Parameters<typeof SplitText>[0] & {
    triggerId: string;
    shouldPlay: boolean;
  },
) {
  const [playCount, setPlayCount] = useState(0);
  const prevShouldPlayRef = useRef(props.shouldPlay);

  if (props.shouldPlay && !prevShouldPlayRef.current) {
    prevShouldPlayRef.current = true;
    setPlayCount((c) => c + 1);
  } else if (!props.shouldPlay) {
    prevShouldPlayRef.current = false;
  }

  const { triggerId, shouldPlay, ...splitProps } = props;

  return <SplitText {...splitProps} key={`${props.triggerId}-${playCount}`} />;
}

/**
 * Search feature demo — AnimatedBeam connection diagram
 */
function SearchDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const qwenRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[240px] md:h-[280px] w-full items-center justify-center overflow-visible"
    >
      <div className="flex size-full max-w-sm flex-row items-stretch justify-between gap-4 px-4">
        {/* User node */}
        <div className="flex flex-col justify-center">
          <Circle ref={userRef}>
            <Icon icon="glyphs-poly:user" className="size-8" />
          </Circle>
        </div>
        {/* Qwen center node */}
        <div className="flex flex-col justify-center">
          <Circle ref={qwenRef} className="!size-14">
            <Icon icon="logos:qwen-icon" width={28} height={28} />
          </Circle>
        </div>
        {/* Result nodes */}
        <div className="flex flex-col justify-center gap-1.5">
          <Circle ref={imgRef}>
            <Icon icon="logos:bing" width={18} height={18} />
          </Circle>
          <Circle ref={docRef}>
            <Icon icon="material-icon-theme:google" width={18} height={18} />
          </Circle>
          <Circle ref={codeRef}>
            <Icon icon="logos:google-drive" width={18} height={18} />
          </Circle>
          <Circle ref={chatRef}>
            <Icon icon="fluent-color:notebook-24" width={18} height={18} />
          </Circle>
          <Circle ref={brainRef}>
            <Icon icon="skill-icons:obsidian-dark" width={18} height={18} />
          </Circle>
        </div>
      </div>

      {/* Beam connections — 双向流动，回程 X 镜像 */}
      {/* 去程：波浪式依次发出（间隔 0.4s） */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={userRef}
        toRef={qwenRef}
        duration={4}
        delay={0}
        curvature={30}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={imgRef}
        toRef={qwenRef}
        duration={4}
        delay={0.4}
        curvature={45}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={docRef}
        toRef={qwenRef}
        duration={4}
        delay={0.8}
        curvature={55}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={codeRef}
        toRef={qwenRef}
        duration={4}
        delay={1.2}
        curvature={65}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={chatRef}
        toRef={qwenRef}
        duration={4}
        delay={1.6}
        curvature={75}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={brainRef}
        toRef={qwenRef}
        duration={4}
        delay={2.0}
        curvature={85}
      />
      {/* 回程：去程跑完后依次镜像返回（间隔 0.35s） */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={qwenRef}
        toRef={userRef}
        duration={4}
        delay={4.5}
        curvature={-30}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={qwenRef}
        toRef={imgRef}
        duration={4}
        delay={4.85}
        curvature={-45}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={qwenRef}
        toRef={docRef}
        duration={4}
        delay={5.2}
        curvature={-55}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={qwenRef}
        toRef={codeRef}
        duration={4}
        delay={5.55}
        curvature={-65}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={qwenRef}
        toRef={chatRef}
        duration={4}
        delay={5.9}
        curvature={-75}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={qwenRef}
        toRef={brainRef}
        duration={4}
        delay={6.25}
        curvature={-85}
        reverse
      />
    </div>
  );
}

export function FeatureSection() {
  return (
    <>
      {/* Global styles for split-text animation */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        .split-parent {
          display: block !important;
          width: 100% !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
        }
        .split-char {
          display: inline !important;
          white-space: normal !important;
          word-wrap: break-word !important;
          word-break: keep-all !important;
        }
      `}</style>

      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="space-y-16 md:space-y-24">
          {FEATURE_KEYS.map((key, i) => (
            <FeatureRow key={key} featureKey={key} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
