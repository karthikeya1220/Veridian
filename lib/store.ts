import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Company,
  SavedList,
  SavedSearch,
  Note,
  SearchFilters,
  EnrichedData,
} from "@/lib/types";
import { COMPANIES } from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  sector: "",
  stage: "",
  hq: "",
  minScore: 0,
  maxScore: 100,
  tags: [],
};

interface VCStore {
  // State
  companies: Company[];
  lists: SavedList[];
  savedSearches: SavedSearch[];
  notes: Note[];
  filters: SearchFilters;
  selectedCompanyIds: string[];

  // Filter actions
  setFilter: (key: keyof SearchFilters, value: string | number | string[]) => void;
  resetFilters: () => void;
  setFilters: (filters: SearchFilters) => void;

  // Selection actions
  toggleSelected: (id: string) => void;
  clearSelected: () => void;

  // List actions
  createList: (name: string) => void;
  deleteList: (id: string) => void;
  addToList: (listId: string, companyId: string) => void;
  addManyToList: (listId: string, companyIds: string[]) => void;
  removeFromList: (listId: string, companyId: string) => void;

  // SavedSearch actions
  saveSearch: (name: string, filters: SearchFilters) => void;
  deleteSavedSearch: (id: string) => void;

  // Note actions
  addNote: (companyId: string, content: string) => void;
  deleteNote: (id: string) => void;

  // Enrichment action
  setEnriched: (companyId: string, data: EnrichedData) => void;
}

export const useStore = create<VCStore>()(
  persist(
    immer((set) => ({
      // Initial state
      companies: COMPANIES,
      lists: [],
      savedSearches: [],
      notes: [],
      filters: DEFAULT_FILTERS,
      selectedCompanyIds: [],

      // Filter actions
      setFilter: (key, value) =>
        set((state) => {
          (state.filters as Record<keyof SearchFilters, string | number | string[]>)[key] = value;
        }),

      resetFilters: () =>
        set((state) => {
          state.filters = DEFAULT_FILTERS;
        }),

      setFilters: (filters) =>
        set((state) => {
          state.filters = filters;
        }),

      // Selection actions
      toggleSelected: (id) =>
        set((state) => {
          const index = state.selectedCompanyIds.indexOf(id);
          if (index > -1) {
            state.selectedCompanyIds.splice(index, 1);
          } else {
            state.selectedCompanyIds.push(id);
          }
        }),

      clearSelected: () =>
        set((state) => {
          state.selectedCompanyIds = [];
        }),

      // List actions
      createList: (name) =>
        set((state) => {
          const newList: SavedList = {
            id: generateId("list"),
            name,
            companyIds: [],
            createdAt: new Date().toISOString(),
          };
          state.lists.push(newList);
        }),

      deleteList: (id) =>
        set((state) => {
          state.lists = state.lists.filter((list: SavedList) => list.id !== id);
        }),

      addToList: (listId, companyId) =>
        set((state) => {
          const list = state.lists.find((l: SavedList) => l.id === listId);
          if (list && !list.companyIds.includes(companyId)) {
            list.companyIds.push(companyId);
          }
        }),

      addManyToList: (listId, companyIds) =>
        set((state) => {
          const list = state.lists.find((l: SavedList) => l.id === listId);
          if (list) {
            const uniqueIds = new Set([...list.companyIds, ...companyIds]);
            list.companyIds = Array.from(uniqueIds);
          }
        }),

      removeFromList: (listId, companyId) =>
        set((state) => {
          const list = state.lists.find((l: SavedList) => l.id === listId);
          if (list) {
            list.companyIds = list.companyIds.filter((id: string) => id !== companyId);
          }
        }),

      // SavedSearch actions
      saveSearch: (name, filters) =>
        set((state) => {
          const newSearch: SavedSearch = {
            id: generateId("search"),
            name,
            filters: { ...filters },
            createdAt: new Date().toISOString(),
          };
          state.savedSearches.push(newSearch);
        }),

      deleteSavedSearch: (id) =>
        set((state) => {
          state.savedSearches = state.savedSearches.filter(
            (search: SavedSearch) => search.id !== id
          );
        }),

      // Note actions
      addNote: (companyId, content) =>
        set((state) => {
          const noteId = generateId("note");
          const newNote: Note = {
            id: noteId,
            companyId,
            content,
            createdAt: new Date().toISOString(),
          };
          state.notes.push(newNote);

          const company = state.companies.find((c: Company) => c.id === companyId);
          if (company) {
            company.noteIds.push(noteId);
          }
        }),

      deleteNote: (id) =>
        set((state) => {
          const note = state.notes.find((n: Note) => n.id === id);
          if (note) {
            const company = state.companies.find(
              (c: Company) => c.id === note.companyId
            );
            if (company) {
              company.noteIds = company.noteIds.filter((nid: string) => nid !== id);
            }
          }
          state.notes = state.notes.filter((n: Note) => n.id !== id);
        }),

      // Enrichment action
      setEnriched: (companyId, data) =>
        set((state) => {
          const company = state.companies.find((c: Company) => c.id === companyId);
          if (company) {
            company.enriched = data;
          }
        }),
    })),
    {
      name: "vc-scout-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lists: state.lists,
        savedSearches: state.savedSearches,
        notes: state.notes,
      }),
    }
  )
);
