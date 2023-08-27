import type { DeviceInfo } from '~/types';

// taken from: https://github.com/nuxt-community/device-module/blob/master/src/runtime/generateFlags.ts
const REGEX_MOBILE_OR_TABLET1 = /(?:android|bb\d|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|FBAN|FBAV|fennec|hiptop|iemobile|ip(?:hone|od)|Instagram|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(?:ob|in)i|palm(?: os)?|phone|p(?:ixi|re)\/|plucker|pocket|psp|series(?:4|6)0|symbian|treo|up\.(?:browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
const REGEX_MOBILE_OR_TABLET2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(?:er|oo|s-)|ai(?:ko|rn)|al(?:av|ca|co)|amoi|an(?:ex|ny|yw)|aptu|ar(?:ch|go)|as(?:te|us)|attw|au(?:di|-m|r |s )|avan|be(?:ck|ll|nq)|bi(?:lb|rd)|bl(?:ac|az)|br(?:e|v)w|bumb|bw-(?:n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(?:mp|nd)|craw|da(?:it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(?:c|p)o|ds(?:12|-d)|el(?:49|ai)|em(?:l2|ul)|er(?:ic|k0)|esl8|ez(?:[4-7]0|os|wa|ze)|fetc|fly(?:-|_)|g1 u|g560|gene|gf-5|g-mo|go(?:\.w|od)|gr(?:ad|un)|haie|hcit|hd-[mpt]|hei-|hi(?:pt|ta)|hp(?: i|ip)|hs-c|ht(?:c[\- _agpst]|tp)|hu(?:aw|tc)|i-(?:20|go|ma)|i230|iac[ \-/]|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(?:t|v)a|jbro|jemu|jigs|kddi|keji|kgt(?: |\/)|klon|kpt |kwc-|kyo(?:c|k)|le(?:no|xi)|lg(?: g|\/[klu]|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(?:te|ui|xo)|mc(?:01|21|ca)|m-cr|me(?:rc|ri)|mi(?:o8|oa|ts)|mmef|mo(?:01|02|bi|de|do|t[\- ov]|zz)|mt(?:50|p1|v )|mwbp|mywa|n10[0-2]|n20[23]|n30(?:0|2)|n50[025]|n7(?:0(?:0|1)|10)|ne(?:(?:c|m)-|on|tf|wf|wg|wt)|nok(?:6|i)|nzph|o2im|op(?:ti|wv)|oran|owg1|p800|pan[adt]|pdxg|pg(?:13|-[1-8c])|phil|pire|pl(?:ay|uc)|pn-2|po(?:ck|rt|se)|prox|psio|pt-g|qa-a|qc(?:07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(?:ve|zo)|s55\/|sa(?:ge|ma|mm|ms|ny|va)|sc(?:01|h-|oo|p-)|sdk\/|se(?:c[\-01]|47|mc|nd|ri)|sgh-|shar|sie(?:-|m)|sk-0|sl(?:45|id)|sm(?:al|ar|b3|it|t5)|so(?:ft|ny)|sp(?:01|h-|v-|v )|sy(?:01|mb)|t2(?:18|50)|t6(?:00|10|18)|ta(?:gt|lk)|tcl-|tdg-|tel(?:i|m)|tim-|t-mo|to(?:pl|sh)|ts(?:70|m-|m3|m5)|tx-9|up(?:\.b|g1|si)|utst|v400|v750|veri|vi(?:rg|te)|vk(?:40|5[0-3]|-v)|vm40|voda|vulc|vx(?:52|53|60|61|70|80|81|83|85|98)|w3c(?:-| )|webc|whit|wi(?:g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;
const REGEX_IS_FIREFOX = /firefox|iceweasel|fxios/i;

export function checkIsMobileOrTablet(a: string): boolean {
  return REGEX_MOBILE_OR_TABLET1.test(a) || REGEX_MOBILE_OR_TABLET2.test((a || '').slice(0, 4));
}

export function checkIsFirefox(a: string): boolean {
  return REGEX_IS_FIREFOX.test(a);
}

const cache = new Map<string, DeviceInfo>();

export function parseUA(userAgent: string): DeviceInfo {
  if (cache.has(userAgent))
    return cache.get(userAgent)!;

  const deviceInfo: DeviceInfo = {
    isMobileOrTablet: checkIsMobileOrTablet(userAgent),
    isFirefox: checkIsFirefox(userAgent),
  };

  cache.set(userAgent, deviceInfo);

  return deviceInfo;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('User-Agent parsing', () => {
    it('Detects mobile or tablet', () => {
      const chromeAndroid = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.3';
      const chromeIphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/115.0.5790.130 Mobile/15E148 Safari/604.';
      const safariIphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Mobile/15E148 Safari/604.';
      const firefoxLg = 'Mozilla/5.0 (Android 13; Mobile; LG-M255; rv:115.0) Gecko/115.0 Firefox/115.0';
      const firefoxIpad = 'Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/115.0 Mobile/15E148 Safari/605.1.15';

      expect(checkIsMobileOrTablet(chromeAndroid)).toBe(true);
      expect(checkIsMobileOrTablet(chromeIphone)).toBe(true);
      expect(checkIsMobileOrTablet(safariIphone)).toBe(true);
      expect(checkIsMobileOrTablet(firefoxLg)).toBe(true);
      expect(checkIsMobileOrTablet(firefoxIpad)).toBe(true);
    });

    it('Detects Firefox browser', () => {
      const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0';
      const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

      expect(checkIsFirefox(firefoxUA)).toBe(true);
      expect(checkIsFirefox(chromeUA)).toBe(false);
    });
  });
}
