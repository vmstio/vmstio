export default defineAppConfig({
  docus: {
    title: 'docs.vmst.io',
    description: 'Documentation for vmst.io',
    image: 'https://raw.githubusercontent.com/vmstan/vmstio/main/images/vmstio-1280x640@3x.png',
    socials: {
      mastodon: {
        label: 'Mastodon',
        icon: 'simple-icons:mastodon',
        href: 'https://vmst.io',
      },
      github: 'vmstan/vmstio'
    },
    aside: {
      level: 1,
      collapsed: true,
      exclude: []
    },
    header: {
      logo: false,
      title: 'docs.vmst.io',
      showLinkIcon: true
    },
    footer: {
      iconLinks: [
        {
          href: 'https://nuxt.com',
          icon: 'simple-icons:nuxtdotjs'
        }
      ]
    }
  }
})
