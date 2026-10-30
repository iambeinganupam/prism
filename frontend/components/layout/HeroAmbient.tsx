"use client";

import dynamic from "next/dynamic";
import { HeroAmbientProps } from "./HeroAmbientContent";
import { HeroAmbientFallback } from "./HeroAmbientFallback";

export type { HeroAmbientProps };

export const HeroAmbient = dynamic<HeroAmbientProps>(
  () => import("./HeroAmbientContent").then((mod) => mod.HeroAmbientContent),
  {
    ssr: false,
    loading: () => <HeroAmbientFallback />,
  }
);

export { HeroAmbientFallback };
export default HeroAmbient;
