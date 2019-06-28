import { card } from './card'
import { service } from './service'
import { user } from './user'
import { message } from './message'
import { equipment } from './equipment'

export const overall = {
    uploadUrl: process.env.VUE_APP_BASE_API + '/oss/upload',
    card: card,
    service: service,
    user: user,
    message: message,
    equipment: equipment
} 