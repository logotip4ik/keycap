export default defineAppConfig({
  shortcuts: {
    new: '$mod+Shift+A',
    search: '$mod+KeyK',
  },

  iconsToPreload: ['ic:outline-info', 'material-symbols:close-rounded'],

  nuxtIcon: {
    aliases: {
      close: 'material-symbols:close-rounded',
      search: 'material-symbols:search-rounded',
    },
  },
});
