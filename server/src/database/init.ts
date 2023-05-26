import {
    Room,
    User
} from './models'

const dbInit = () => Promise.all([
    User.sync({ alter: false }),
    Room.sync({ alter: false }),
])

export default dbInit 
