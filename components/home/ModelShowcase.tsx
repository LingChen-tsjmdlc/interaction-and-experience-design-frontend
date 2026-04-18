"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface ModelCard {
  name: string;
  description: string;
  tags: string[];
  icon: string;
}

export interface TranslatedModelCard extends ModelCard {
  translatedTags: string[];
}

/** 单个模型卡片 — 华丽 hover 动画 + 入场动画 */
function ModelCardItem({
  model,
  tagColors,
  index,
}: {
  model: TranslatedModelCard;
  tagColors: Record<string, string>;
  index: number;
}) {
  // 根据标签决定图标高亮色
  const accentColor = model.tags.includes("latest")
    ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
    : model.tags.includes("visual")
      ? "text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
      : model.tags.includes("multimodal")
        ? "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        : model.tags.includes("text")
          ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          : "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]";

  const borderColor = model.tags.includes("latest")
    ? "group-hover/feature:border-blue-500/30"
    : model.tags.includes("visual")
      ? "group-hover/feature:border-violet-500/30"
      : model.tags.includes("multimodal")
        ? "group-hover/feature:border-purple-500/30"
        : model.tags.includes("text")
          ? "group-hover/feature:border-emerald-500/30"
          : "group-hover/feature:border-orange-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.12 + Math.floor(index / 3) * 0.18,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className={cn(
          "flex flex-col lg:border-r border-default-200/50 py-7 px-5 relative group/feature dark:border-neutral-800",
          "transition-all duration-300 ease-out rounded-xl cursor-default m-1 min-h-[260px]",
          "overflow-hidden",
          borderColor,
          (index === 0 || index === 4 || index === 8) && "lg:border-l dark:border-neutral-800",
          index < 8 && "lg:border-b dark:border-neutral-800",
          "hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-black/20",
          "hover:-translate-y-0.5",
        )}
      >
        {/* 背景渐变层 */}
        <div
          className={cn(
            "opacity-0 group-hover/feature:opacity-100 transition-all duration-500 ease-out",
            "absolute inset-0 w-full rounded-xl pointer-events-none",
            index % 3 === 0 &&
              "bg-gradient-to-br from-blue-500/[0.04] via-transparent to-violet-500/[0.04]",
            index % 3 === 1 &&
              "bg-gradient-to-br from-violet-500/[0.04] via-transparent to-purple-500/[0.04]",
            index % 3 === 2 &&
              "bg-gradient-to-br from-purple-500/[0.04] via-transparent to-pink-500/[0.04]",
          )}
        />

        {/* 角落光晕装饰 */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className={cn(
              "absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl",
              model.tags.includes("latest") && "bg-blue-400/15",
              model.tags.includes("visual") && !model.tags.includes("latest") && "bg-violet-400/15",
              model.tags.includes("multimodal") && "bg-purple-400/15",
              model.tags.includes("text") && "bg-emerald-400/15",
              model.tags.includes("inference") &&
                !model.tags.includes("text") &&
                "bg-orange-400/15",
            )}
          />
        </div>

        {/* 图标 + 标签行 */}
        <div className="mb-3 relative z-10 flex items-start justify-between gap-2">
          {/* Icon：放大 + 变色 + 发光 */}
          <Icon
            icon={model.icon}
            className={cn(
              "size-7 shrink-0 transition-all duration-300 ease-out",
              "text-default-400 dark:text-default-500",
              `group-hover/feature:scale-125 ${accentColor}`,
            )}
          />
          <div className="flex gap-1.5 flex-wrap justify-end">
            {model.translatedTags.map((translatedTag, idx) => {
              const tagKey = model.tags[idx];
              return (
                <span
                  key={tagKey}
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
                    "transition-all duration-300 group-hover/feature:scale-105 group-hover/feature:shadow-sm",
                    tagColors[tagKey] ??
                      "bg-default-100 text-default-600 dark:bg-neutral-800 dark:text-neutral-400",
                  )}
                >
                  {translatedTag}
                </span>
              );
            })}
          </div>
        </div>

        {/* 标题：加粗 + 放大 + 左移 */}
        <div className="relative z-10 mb-1.5">
          {/* 动态竖条指示器 */}
          <div
            className={cn(
              "absolute left-0 top-0 w-[3px] rounded-full",
              "h-5 group-hover/feature:h-[26px]",
              "bg-default-300 dark:bg-neutral-700 transition-all duration-300 ease-out origin-center",
              "group-hover/feature:bg-gradient-to-b group-hover/feature:from-primary group-hover/feature:to-purple-500",
              "group-hover/feature:shadow-sm group-hover/feature:shadow-primary/40",
            )}
          />
          <span
            className={cn(
              "ml-3 inline-block text-foreground transition-all duration-300 ease-out",
              "text-base leading-snug font-semibold",
              "group-hover/feature:translate-x-2.5",
              "group-hover/feature:scale-105 group-hover/feature:font-bold",
              "group-hover/feature:tracking-tight",
            )}
          >
            {model.name}
          </span>
        </div>

        {/* 描述：颜色加深 + 轻微上移 */}
        <p
          className={cn(
            "text-xs leading-relaxed relative z-10 ml-3 transition-all duration-300 ease-out",
            "text-default-500 dark:text-default-500 line-clamp-3",
            "group-hover/feature:text-default-700 dark:group-hover/feature:text-default-300",
            "group-hover/feature:line-clamp-4",
          )}
        >
          {model.description}
        </p>
      </div>
    </motion.div>
  );
}

/** 模型展示区域 — 3x3 Grid 布局 */
export function ModelShowcase() {
  const { t } = useTranslation();

  // 从 i18n 读取模型数据
  const modelData = useMemo(() => {
    try {
      const models: ModelCard[] = t("modelShowcase.models", {
        returnObjects: true,
      }) as unknown as ModelCard[];
      return models;
    } catch {
      return [];
    }
  }, [t]);

  // 从 i18n 读取标签颜色映射
  const tagColors = useMemo(() => {
    try {
      const colors = t("modelShowcase.tagColors", { returnObjects: true }) as Record<
        string,
        string
      >;
      return colors;
    } catch {
      return {};
    }
  }, [t]);

  // 翻译标签 key 为本地化文本
  const translatedModels: TranslatedModelCard[] = useMemo(() => {
    return modelData.map((model) => ({
      ...model,
      translatedTags: model.tags.map((tagKey) => t(`modelShowcase.tags.${tagKey}`)),
    }));
  }, [modelData, t]);

  return (
    <div className="relative z-10 mx-auto w-full px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {translatedModels.map((model, index) => (
          <ModelCardItem key={model.name} model={model} tagColors={tagColors} index={index} />
        ))}
      </div>
    </div>
  );
}
