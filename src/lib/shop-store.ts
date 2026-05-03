import { useEffect, useState } from "react";

export type ShopVariant = "her" | "him" | "couples";

type ShopState = {
  variant: ShopVariant;
  price: number;
  bundleLabel: string; // "1 Bottle" | "2 Bottles" | "1 Set" etc.
};

const listeners = new Set<(s: ShopState) => void>();
let state: ShopState = { variant: "her", price: 899, bundleLabel: "2 Bottles" };

export function setShopState(partial: Partial<ShopState>) {
  state = { ...state, ...partial };
  listeners.forEach((l) => l(state));
}

export function getShopState() {
  return state;
}

export function useShopState(): ShopState {
  const [s, setS] = useState(state);
  useEffect(() => {
    const fn = (next: ShopState) => setS(next);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return s;
}
