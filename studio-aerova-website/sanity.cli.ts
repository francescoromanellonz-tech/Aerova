import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ax0dvpzv',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
    appId: 'by1kh7oq3e9tfn58g5ivzmbr',
  }
})
