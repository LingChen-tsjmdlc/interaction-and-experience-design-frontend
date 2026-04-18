"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, Variants } from "framer-motion";

interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
  className?: string;
  /** 基础延迟（秒），所有按钮动画在此基础上叠加 */
  baseDelay?: number;
}

// 单个按钮的动画变体
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// 容器的交错动画
const containerVariants = (baseDelay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: baseDelay,
      staggerChildren: 0.1,
    },
  },
});

export function QuickActions({ onActionClick, className = "", baseDelay = 0 }: QuickActionsProps) {
  const { t } = useTranslation();

  const actions: QuickAction[] = [
    { id: "image-edit", label: t("quickActions.imageEdit"), icon: "lucide:image" },
    { id: "deep-think", label: t("quickActions.deepThink"), icon: "lucide:brain" },
    { id: "search", label: t("quickActions.search"), icon: "lucide:search" },
    { id: "web-dev", label: t("quickActions.webDev"), icon: "lucide:code" },
    { id: "preview", label: t("quickActions.preview"), icon: "lucide:eye" },
    { id: "research", label: t("quickActions.research"), icon: "lucide:book-open" },
    { id: "image-gen", label: t("quickActions.imageGen"), icon: "lucide:wand-2" },
    { id: "video-gen", label: t("quickActions.videoGen"), icon: "lucide:film" },
  ];

  return (
    <motion.div
      className={`flex flex-col items-center gap-3 ${className}`}
      variants={containerVariants(baseDelay)}
      initial="hidden"
      animate="visible"
    >
      {/* 第一行：5个按钮 */}
      <div className="flex flex-wrap justify-center gap-3">
        {actions.slice(0, 5).map((action) => (
          <motion.div key={action.id} variants={itemVariants}>
            <Button
              variant="bordered"
              size="sm"
              radius="full"
              startContent={<Icon icon={action.icon} className="w-4 h-4" />}
              onPress={() => onActionClick?.(action.id)}
              className="hover:scale-105 transition-transform duration-200"
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* 第二行：3个按钮 */}
      <div className="flex flex-wrap justify-center gap-3">
        {actions.slice(5).map((action) => (
          <motion.div key={action.id} variants={itemVariants}>
            <Button
              variant="bordered"
              size="sm"
              radius="full"
              startContent={<Icon icon={action.icon} className="w-4 h-4" />}
              onPress={() => onActionClick?.(action.id)}
              className="hover:scale-105 transition-transform duration-200"
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
