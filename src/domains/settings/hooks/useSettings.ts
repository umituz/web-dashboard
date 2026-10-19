import { useReducer, useCallback } from "react";
import type { SettingsConfig, SettingsItem } from "../types/settings";

type SettingsAction =
  | { type: 'updateItem'; sectionKey: string; itemKey: string; updates: Partial<SettingsItem> }
  | { type: 'toggleItem'; sectionKey: string; itemKey: string }
  | { type: 'setItemBadge'; sectionKey: string; itemKey: string; badge: number | undefined };

const mapItemInTree = (
  config: SettingsConfig,
  sectionKey: string,
  itemKey: string,
  transform: (item: SettingsItem) => SettingsItem,
): SettingsConfig => ({
  ...config,
  sections: config.sections.map((section) =>
    section.key !== sectionKey
      ? section
      : {
          ...section,
          items: section.items.map((item) => (item.key === itemKey ? transform(item) : item)),
        },
  ),
});

const settingsReducer = (state: SettingsConfig, action: SettingsAction): SettingsConfig => {
  switch (action.type) {
    case 'updateItem':
      return mapItemInTree(state, action.sectionKey, action.itemKey, (item) => ({
        ...item,
        ...action.updates,
      }));
    case 'toggleItem':
      return mapItemInTree(state, action.sectionKey, action.itemKey, (item) => ({
        ...item,
                enabled: item.enabled === undefined ? false : !item.enabled,
      }));
    case 'setItemBadge':
      return mapItemInTree(state, action.sectionKey, action.itemKey, (item) => ({
        ...item,
        badge: action.badge,
      }));
  }
};

export interface UseSettingsReturn {
  config: SettingsConfig;
  updateItem: (sectionKey: string, itemKey: string, updates: Partial<SettingsItem>) => void;
  toggleItem: (sectionKey: string, itemKey: string) => void;
  setItemBadge: (sectionKey: string, itemKey: string, badge: number | undefined) => void;
}

export function useSettings(initialConfig: SettingsConfig): UseSettingsReturn {
  const [config, dispatch] = useReducer(settingsReducer, initialConfig);

  const updateItem = useCallback(
    (sectionKey: string, itemKey: string, updates: Partial<SettingsItem>) => {
      dispatch({ type: 'updateItem', sectionKey, itemKey, updates });
    },
    [],
  );

  const toggleItem = useCallback((sectionKey: string, itemKey: string) => {
    dispatch({ type: 'toggleItem', sectionKey, itemKey });
  }, []);

  const setItemBadge = useCallback(
    (sectionKey: string, itemKey: string, badge: number | undefined) => {
      dispatch({ type: 'setItemBadge', sectionKey, itemKey, badge });
    },
    [],
  );

  return {
    config,
    updateItem,
    toggleItem,
    setItemBadge,
  };
}
