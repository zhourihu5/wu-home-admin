// import defaultSettings from '@/settings'

// const title = defaultSettings.title || '吾家管理平台'

// export default function getPageTitle(pageTitle) {
//   if (pageTitle) {
//     return `${pageTitle} - ${title}`
//   }
//   return `${title}`
// }


import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || '吾家管理平台'

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}