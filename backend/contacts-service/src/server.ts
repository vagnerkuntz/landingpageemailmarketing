import app from './app'
import database from 'commons/data/db'

(async () => {
  try {
    const port = parseInt(`${process.env.PORT}`)
    
    await database.sync()
    console.log(`Server is using database ${process.env.DB_NAME}`)

    app.listen(port)
    console.log(`Server ${process.env.SERVICE_NAME} is running on port ${port}`)
  } catch(error) {
    console.log(`Server: ${error}`)
  }
})()
