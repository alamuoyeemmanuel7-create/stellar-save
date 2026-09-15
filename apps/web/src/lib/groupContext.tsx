"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type GroupData = {
  id: number;
  creator: string;
  token: string;
  contribution_amount: bigint;
  num_members: number;
  members: string[];
  current_round: number;
  is_open: boolean;
};

interface GroupContextType {
  groups: Map<number, GroupData>;
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;
  addGroup: (id: number, data: GroupData) => void;
  updateGroup: (id: number, data: Partial<GroupData>) => void;
  getGroup: (id: number) => GroupData | undefined;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Map<number, GroupData>>(new Map());
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addGroup = useCallback((id: number, data: GroupData) => {
    setGroups((prev) => new Map(prev).set(id, data));
  }, []);

  const updateGroup = useCallback((id: number, data: Partial<GroupData>) => {
    setGroups((prev) => {
      const updated = new Map(prev);
      const existing = updated.get(id);
      if (existing) {
        updated.set(id, { ...existing, ...data });
      }
      return updated;
    });
  }, []);

  const getGroup = useCallback((id: number) => groups.get(id), [groups]);

  return (
    <GroupContext.Provider
      value={{
        groups,
        selectedGroupId,
        setSelectedGroupId,
        addGroup,
        updateGroup,
        getGroup,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroups must be used within GroupProvider");
  }
  return context;
}
