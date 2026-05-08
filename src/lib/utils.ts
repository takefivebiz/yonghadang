import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "오늘";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "어제";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    love: "연애",
    relationship: "인간관계",
    career: "직업·진로",
    emotion: "감정",
  };
  return categoryMap[category] || category;
}
