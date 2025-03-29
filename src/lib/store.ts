import { create } from "zustand"
//import { devtools } from 'zustand/middleware'
import type { Knight } from "./types"
import { initialData } from "./initial-data";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";

interface KnightsStore {
  knights: Knight[];

  addKnight: (knight: Knight) => void;
  updateKnight: (knight: Knight) => void;
  deleteKnight: (knightName: string) => void;
  loadKnights: (knights: Knight[]) => void;

}

export const useKnightsStore = create<KnightsStore>()(
  devtools(
		persist(
  
  (set) => ({
  knights: initialData.cavalieri,
  
  addKnight: (knight) => set((state) => ({ knights: [...state.knights, knight] })),
  updateKnight: (knight) => set((state) => ({
    knights: state.knights.map(k => k.nome === knight.nome ? knight : k)
  })),
  deleteKnight: (knightName) => set((state) => ({
    knights: state.knights.filter(k => k.nome !== knightName)
  })),
  loadKnights: (knights) => set({ knights })
}), {
  name: "king-choice", // Nome del localStorage
				storage: createJSONStorage(() => localStorage),
				// Partialize permette di salvare solo alcune proprietà dello stato
				partialize: (state) => ({
				knights: state.knights
				}),
})))