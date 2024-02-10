export async function validateTurnstileReponse(response: string) {
  const { secret, endpoint } = useRuntimeConfig().turnstile;

  const validation = await $fetch<{ success: boolean }>(endpoint, {
    method: 'POST',
    body: { secret, response },
  });

  return validation.success;
}
