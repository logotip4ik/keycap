import type { ValueOf } from 'type-fest';

export type Settings = typeof settings;
export type SettingsDefinitions = typeof settingsDefinitions;

interface SettingDefinition<T> {
  value: T
  defaultValue: T
  posibleValues: Array<T>
}

export const SETTINGS_PREFIX = 's:';

export const settings = {
  formatterPosition: 'fmt-pos',
  spellcheck: 'splchk',
} as const;

const settingsDefinitions = {
  [settings.formatterPosition]: defineSetting({
    defaultValue: 'top',
    posibleValues: ['top', 'bottom'] as const,
  }),
  [settings.spellcheck]: defineSetting({
    defaultValue: 'no',
    posibleValues: ['yes', 'no'] as const,
  }),
} satisfies Record<ValueOf<Settings>, SettingDefinition<unknown>>;

export function getSetting<T extends ValueOf<Settings>>(setting: T): SettingsDefinitions[T] {
  const definition = settingsDefinitions[setting];

  const value = getUCookie(SETTINGS_PREFIX + setting);
  if (value && definition.posibleValues.includes(value)) {
    definition.value = value as SettingsDefinitions[T]['posibleValues'][number];
  }

  return definition;
}

export function setSetting<T extends ValueOf<Settings>>(setting: T, value: SettingsDefinitions[T]['posibleValues'][number]): void {
  setUCookie(SETTINGS_PREFIX + setting, value, {
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: parseDuration('6 months', 's'),
  });
}

/* #__NO_SIDE_EFFECTS__ */
function defineSetting<T>({ defaultValue, posibleValues }: {
  defaultValue: NoInfer<T>
  posibleValues: Array<T>
}): SettingDefinition<T> {
  return {
    value: defaultValue,
    defaultValue,
    posibleValues,
  };
}
