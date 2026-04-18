"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ChevronRight,
  FileIcon as LucideFile,
  FolderOpen,
  Folder as FolderIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type TreeViewElement = {
  id: string;
  name: string;
  type?: "file" | "folder";
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction?: string;
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

const isFolderElement = (element: TreeViewElement) => {
  if (element.type) return element.type === "folder";
  return Array.isArray(element.children);
};

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  "defaultValue" | "onValueChange" | "type" | "value"
>;

// ====== 简化版 Tree：移除 ScrollArea/Button 依赖 ======
export const Tree: React.FC<TreeViewProps> = ({
  className,
  elements,
  initialSelectedId,
  initialExpandedItems,
  indicator = true,
  openIcon,
  closeIcon,
  ...props
}) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
  const [expandedItems, setExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

  const selectItem = useCallback((id: string) => setSelectedId(id), []);
  const handleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      if (prev?.includes(id)) return prev.filter((item) => item !== id);
      return [...(prev ?? []), id];
    });
  }, []);

  // 初始选中时展开父级
  const expandParent = useCallback(
    (els?: TreeViewElement[], selId?: string, path: string[] = []) => {
      if (!els || !selId) return;
      els.forEach((el) => {
        const newPath = [...path, el.id];
        if (el.id === selId)
          setExpandedItems((prev) => [...new Set([...(prev ?? []), ...newPath])]);
        if (Array.isArray(el.children)) expandParent(el.children, selId, newPath);
      });
    },
    [],
  );

  React.useEffect(() => {
    if (initialSelectedId) expandParent(elements, initialSelectedId);
  }, [initialSelectedId, elements, expandParent]);

  const renderElements = (items: TreeViewElement[]) =>
    items.map((element) => {
      if (isFolderElement(element))
        return (
          <Folder
            key={element.id}
            value={element.id}
            element={element.name}
            isSelectable={element.isSelectable}
            openIcon={openIcon}
            closeIcon={closeIcon}
            indicator={indicator}
          >
            {Array.isArray(element.children) ? renderElements(element.children) : null}
          </Folder>
        );
      return (
        <File key={element.id} value={element.id} isSelectable={element.isSelectable}>
          <span>{element.name}</span>
        </File>
      );
    });

  return (
    <TreeContext.Provider
      value={{
        selectedId,
        expandedItems,
        handleExpand,
        selectItem,
        setExpandedItems,
        indicator,
        openIcon,
        closeIcon,
        direction: "ltr",
      }}
    >
      <div className={cn("size-full overflow-auto", className)}>
        <AccordionPrimitive.Root
          {...props}
          type="multiple"
          value={expandedItems}
          className="flex flex-col gap-1"
        >
          {elements ? renderElements(elements) : null}
        </AccordionPrimitive.Root>
      </div>
    </TreeContext.Provider>
  );
};
Tree.displayName = "Tree";

// ====== 指示线 ======
function TreeIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-2 top-0 h-full w-px rounded-md py-3 hover:bg-slate-300",
        className,
      )}
    />
  );
}

// ====== 文件夹节点 ======
function Folder({
  value,
  element,
  isSelectable = true,
  openIcon,
  closeIcon,
  indicator,
  children,
}: {
  value: string;
  element: string;
  isSelectable?: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  indicator?: boolean;
  children?: React.ReactNode;
}) {
  const { handleExpand, expandedItems, selectedId, selectItem } = useTree();
  const isSelected = selectedId === value;
  const isExpanded = expandedItems?.includes(value);

  return (
    <AccordionPrimitive.Item value={value} className="relative h-full overflow-hidden">
      <AccordionPrimitive.Trigger
        onClick={() => {
          selectItem(value);
          handleExpand(value);
        }}
        disabled={!isSelectable}
        className={cn("flex items-center gap-1.5 rounded-md px-1 py-1 text-sm w-full text-left", {
          "bg-muted": isSelected && isSelectable,
          "cursor-pointer": isSelectable,
          "cursor-not-allowed opacity-50": !isSelectable,
        })}
      >
        {/* 展开/折叠箭头 */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={cn("transition-transform duration-200", isExpanded ? "rotate-90" : "")}
        >
          <path
            d="M4 2L8 6L4 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 文件夹图标 */}
        <span className="flex size-4 shrink-0 items-center justify-center">
          {isExpanded
            ? (openIcon ?? <FolderOpen className="size-4" />)
            : (closeIcon ?? <FolderIcon className="size-4" />)}
        </span>
        <span className="truncate">{element}</span>
      </AccordionPrimitive.Trigger>

      <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative h-full overflow-hidden text-sm pl-5">
        {element && indicator && <TreeIndicator />}
        {children}
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

// ====== 文件节点 ======
function File({
  value,
  isSelectable = true,
  children,
}: {
  value: string;
  isSelectable?: boolean;
  children?: React.ReactNode;
}) {
  const { selectedId, selectItem } = useTree();
  const isSelected = selectedId === value;

  return (
    <button
      type="button"
      disabled={!isSelectable}
      onClick={() => selectItem(value)}
      className={cn(
        "flex w-fit items-center gap-1.5 rounded-md px-1 py-1 text-sm duration-200 ease-in-out",
        {
          "bg-muted": isSelected && isSelectable,
        },
        isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
      )}
    >
      <LucideFile className="size-4 shrink-0" />
      {children}
    </button>
  );
}

export { File, Folder, Tree as FileTree };
export type { TreeViewElement };
