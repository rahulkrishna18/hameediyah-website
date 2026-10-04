"use client";

import dynamic from "next/dynamic";

/** WebGL scenes are client-only and split into their own chunks. */
export const SpiceScene = dynamic(() => import("./SpiceScene"), { ssr: false, loading: () => null });
export const KandarScene = dynamic(() => import("./KandarScene"), { ssr: false, loading: () => null });
