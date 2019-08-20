
// 获取菜单名称
export function generateTitle(title) {
  const hasKey = this.$te('route.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + title)

    return translatedTitle
  }
  return title
}

// 获取提示语
export function generatePoint(title) {
  const hasKey = this.$te('point.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('point.' + title)

    return translatedTitle
  }
  return title
}

export function generateI18n(title) {
  const hasKey = this.$te(title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t(title)

    return translatedTitle
  }
  return title
}
