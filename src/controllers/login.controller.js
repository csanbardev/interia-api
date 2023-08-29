import { pool } from "../db.js"
import bcrypt from "bcrypt"
import pkg from 'jsonwebtoken'



export const loginUser = async (req, res) => {
  const { body } = req
  const { nick, password } = body

  const [rows] = await pool.query("select * from users where nick=?", [nick])

  const user = rows[0]

  const passwordCorrect = user === undefined
    ? false
    : await bcrypt.compare(password, user.password)


  if(!(user && passwordCorrect)) return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })

  const userForToken = {
    id_user: user.id_user,
    nick: user.nick,
    role: user.role
  }

  const token = pkg.sign(userForToken, process.env.SECRET)

  return res.status(200).json({
    id_user: user.id_user,
    nick: user.nick,
    token, 
    role: user.role,
    avatar: user.avatar
  })


}