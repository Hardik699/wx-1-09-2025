import type { LucideIcon } from "lucide-react";

export type Asset = {
  id: string;
  category: string;
  serialNumber: string;
  vendorName: string;
  companyName?: string;
  purchaseDate: string;
  warrantyEndDate: string;
  createdAt: string;
  vonageNumber?: string;
  vonageExtCode?: string;
  vonagePassword?: string;
};

export const STORAGE_KEY = "systemAssets";

export function categoryCodeFor(category: string): string {
  switch (category) {
    case "mouse":
      return "M";
    case "keyboard":
      return "K";
    case "motherboard":
      return "MB";
    case "ram":
      return "R";
    case "power-supply":
      return "PS";
    case "headphone":
      return "H";
    case "camera":
      return "C";
    case "monitor":
      return "MN";
    case "vonage":
      return "V";
    default:
      return "X";
  }
}

export function nextWxId(assets: Asset[], category: string): string {
  const code = categoryCodeFor(category);
  let max = 0;
  for (const a of assets) {
    if (a.category !== category) continue;
    const mNew = a.id.match(new RegExp(`^WX-${code}-(\\d+)$`));
    if (mNew) {
      const n = parseInt(mNew[1], 10);
      if (!Number.isNaN(n)) {
        max = Math.max(max, n);
      }
      continue;
    }
    const mOld = a.id.match(/^WX-(\d+)$/);
    if (mOld) {
      const n = parseInt(mOld[1], 10);
      if (!Number.isNaN(n)) {
        max = Math.max(max, n);
      }
    }
  }
  const next = String(max + 1).padStart(3, "0");
  return `WX-${code}-${next}`;
}

export type RegistryItem = {
  title: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
};

export const canonical: Record<string, string> = {
  moush: "mouse",
  keybord: "keyboard",
  motherbord: "motherboard",
  rem: "ram",
  hadphone: "headphone",
  moniter: "monitor",
};
