import { connectToDatabase, db } from './loaders/database'
;(async () => {
    await connectToDatabase()
    
    await Promise.all([
        db.users.createIndex(['discordId'], { unique: true }),
        db.sections.createIndex(['key'], { unique: true })
    ])

    console.log('database initialized')

    process.exit()
})()
