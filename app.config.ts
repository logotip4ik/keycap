export default defineAppConfig({
  shortcuts: {
    new: '$mod+Shift+A',
    search: '$mod+K',
  },

  iconsToPreload: ['ic:outline-info'],

  nuxtIcon: {
    aliases: {
      close: 'material-symbols:close-rounded',
      search: 'material-symbols:search-rounded',
    },
  },
});
