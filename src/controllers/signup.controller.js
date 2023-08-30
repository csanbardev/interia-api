import { pool } from '../db.js'
import bcrypt from "bcrypt"
import pkg from 'jsonwebtoken'

export const signupUser = async (req, res) => {
  const { body } = req
  const { nick, password, email } = body

  const defaultAvatar = "uploads/user.png"
  const defaultRole = "user"

  try {
    const [rows] = await pool.query('insert into users (nick, password, email, role, avatar) values (?, ?, ?, ?, ?)', [nick, password, email, defaultRole, defaultAvatar])

    const userId = rows.insertId

    const userForToken = {
      id_user: userId,
      nick,
      role: 'user'
    }

    const token = pkg.sign(userForToken, process.env.SECRET)

    return res.status(200).json({
      id_user: userId,
      nick,
      token,
      role: defaultRole,
      avatar: defaultAvatar
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar usuario',
      error
    })
  }

}