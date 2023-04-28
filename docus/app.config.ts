export default defineAppConfig({
  docus: {
    title: 'docs.vmst.io',
    description: 'The best place to start your documentation.',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
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
