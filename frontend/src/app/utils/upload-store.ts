"use client";
import { create } from "zustand";

type UploadPayload = {
  file: File | null;
  jobTypeId: number | null;
  positionId: number | null;
};

type UploadStore = UploadPayload & {
  setPayload: (p: UploadPayload) => void;
  reset: () => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  file: null,
  jobTypeId: null,
  positionId: null,
  setPayload: (p) => set(p),
  reset: () => set({ file: null, jobTypeId: null, positionId: null }),
}));
