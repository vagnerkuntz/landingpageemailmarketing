import app from './app'
import database from './db'

(async () => {
  try {
    const port = parseInt(`${process.env.PORT}`)
    
    await database.sync()
    console.log(`Server is using database ${process.env.DB_NAME}`)

    app.listen(port)
    console.log(`Server is running on port ${port}`)
  } catch(error) {
    console.log(`Server: ${error}`)
  }
})()
