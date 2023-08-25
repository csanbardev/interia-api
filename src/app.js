import express from "express";
import tutorialsRoutes from './routes/tutorials.routes.js'
import accessRoutes from './routes/accessControl.routes.js'
import usersRoutes from './routes/users.routes.js'
import likeRoutes from './routes/likes.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import cors from 'cors'
const app = express()

// MIDDLEWARES
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Agrega los métodos HTTP permitidos
  // Puedes agregar más configuraciones de CORS aquí, como encabezados personalizados (Access-Control-Allow-Headers), entre otros.
  next();
})

// ROUTES


app.use(tutorialsRoutes)
app.use(accessRoutes)
app.use(usersRoutes)
app.use(categoriesRoutes)
app.use(likeRoutes)

app.use((req, res, next) => {
  res.status(404).json({
    message: 'endpoint not found'
  })
})


export default app