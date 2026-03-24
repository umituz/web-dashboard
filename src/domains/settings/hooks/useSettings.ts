/**
 * Settings Hooks
 *
 * Custom React hooks for settings functionality
 */

import { useState, useCallback } from "react";
import type { SettingsConfig, SettingsItem } from "../types/settings";

/**
 * Use Settings Hook
 *
 * Manages settings state and actions
 *
 * @param initialConfig - Initial settings configuration
 * @returns Settings state and actions
 */
export function useSettings(initialConfig: SettingsConfig) {
  const [config, setConfig] = useState<SettingsConfig>(initialConfig);

  const updateItem = useCallback(
    (sectionKey: string, itemKey: string, updates: Partial<SettingsItem>) => {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.key === sectionKey
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.key === itemKey ? { ...item, ...updates } : item
                ),
              }
            : section
        ),
      }));
    },
    []
  );

  const toggleItem = useCallback((sectionKey: string, itemKey: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              items: section.items.map((item) =>
                item.key === itemKey
                  ? { ...item, enabled: item.enabled === undefined ? true : !item.enabled }
                  : item
              ),
            }
          : section
      ),
    }));
  }, []);

  const setItemBadge = useCallback((sectionKey: string, itemKey: string, badge: number | undefined) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              items: section.items.map((item) =>
                item.key === itemKey ? { ...item, badge } : item
              ),
            }
          : section
      ),
    }));
  }, []);

  return {
    config,
    updateItem,
    toggleItem,
    setItemBadge,
  };
}
