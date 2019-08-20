import { card } from './card'
import { service } from './service'
import { user } from './user'
import { message } from './message'
import { equipment } from './equipment'
import { buying } from './buying'
import { order } from './order'
import { examine } from './examine'

export const overall = {
    uploadUrl: process.env.VUE_APP_BASE_API + '/oss/upload',
    uploadMult: process.env.VUE_APP_BASE_API + '/oss/uploadMult',
    card: card,
    service: service,
    user: user,
    message: message,
    equipment: equipment,
    buying: buying,
    order: order,
    examine: examine
} 