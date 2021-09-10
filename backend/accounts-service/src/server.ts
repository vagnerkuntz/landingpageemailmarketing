import app from './app'

const port = parseInt(`${process.env.PORT}`);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
