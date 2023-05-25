import { Room } from './models'

const dbInit = () => Promise.all([
    Room.sync({ alter: true }),
])

export default dbInit 