import type { ValueOf } from 'type-fest';
import type { ShallowRef } from 'vue';

export function useSetting<T extends ValueOf<Settings>>(
  key: T,
): Omit<SettingsDefinitions[T], 'value'> & { setting: ShallowRef<SettingsDefinitions[T]['value']> } {
  const mitt = useMitt();

  const definition = getSetting(key);

  const setting = shallowRef(definition.value);

  let updatedSelf = false;
  watch(setting, (value) => {
    updatedSelf = true;

    setSetting(key, value);

    // @ts-expect-error generic message
    mitt.emit(SETTINGS_PREFIX + key, value);
  }, { flush: 'sync' });

  // @ts-expect-error generic message
  mitt.on(SETTINGS_PREFIX + key, (value: SettingsDefinitions[T]['posibleValues'][number]) => {
    if (updatedSelf) {
      return (updatedSelf = false);
    }

    setting.value = value;
  });

  return {
    setting,
    defaultValue: definition.defaultValue,
    posibleValues: definition.posibleValues,
  } as any; // TODO: fix types ?
}
