import { pool } from "../db.js"
import bcrypt from "bcrypt"


/**
 * Get a list of users
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON with tutorials or an error
 */
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("select * from t_users")

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay usuarios disponibles' })

    res.json(rows)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener usuarios',
      error
    })
  }
}

/**
 * Get all data from a given user
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params

    // only the admin or the property user can get data
    if (req.id_user !== id && req.who !== "admin") {
      return res.status(401).json({ message: 'No tienes acceso a los datos del usuario' })
    }


    const [rows] = await pool.query("select * from t_users where usr_id=?", [id])

    if (rows.length <= 0) return res.status(404).json({ message: 'El usuario no existe' })
    res.json(rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener usuario',
      error
    })
  }
}


/**
 * Insert a new user into database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 or an error 
 */
export const createUser = async (req, res) => {
  try {
    const { nick, password, email, role } = req.body

    const hashedPassword = bcrypt.hashSync(password, 10)

    // only admin can change role to admin
    if (req.role === "admin" && req.who !== "admin") {
      return res.status(401).json({ message: 'No tienes acceso al cambio de rol' })

    }

    const [rows] = await pool.query('insert into t_users ( usr_nick, usr_password, usr_email, usr_role) values (?,?,?,?)', [nick, hashedPassword, email, role])

    res.sendStatus(200)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al insertar usuario',
      error
    })
  }
}

/**
 * Update from a certain user 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 or an error
 */
export const updateUser = async (req, res) => {
  const { id } = req.params
  const { nick, password, email, role } = req.body

  try {
    // only the admin or the property user can update
    if (req.id_user !== id && req.who !== "admin") {
      return res.status(401).json({ message: 'No tienes acceso a la actualización' })
    }

    // only admin can change role to admin
    if (req.role === "admin" && req.who !== "admin") {
      return res.status(401).json({ message: 'No tienes acceso al cambio de rol' })
    }


    const [result] = await pool.query(
      'update t_users set usr_nick = IFNULL(?, usr_nick), usr_password = IFNULL(?, usr_password), usr_email = IFNULL(?, usr_email), usr_role = IFNULL(?, usr_role) where usr_id = ?',
      [nick, password, email, role, id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "No se ha encontrado el usuario" })

    res.sendStatus(200)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar usuario',
      error
    })
  }

}

export const updateAvatar = async (req, res) => {
  const { id } = req.params
  
  try {
    const avatar  = req.file.path

    if (!req.file) {
      return res.status(400).json({"message": "No se ha dado un avatar"})
    }

    // only the admin or the property user can update
    if (req.id_user != id && req.who !== "admin") {
      return res.status(401).json({ message: 'No tienes acceso a la actualización' })
    }



    const [result] = await pool.query(
      'update t_users set usr_avatar = IFNULL(?, usr_avatar) where usr_id = ?',
      [avatar, id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "No se ha encontrado el usuario" })

    res.status(200).json({
      avatar_url: avatar
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar avatar',
      error
    })
  }
}

/**
 * Delete a certain tutorial 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 2004 or an error
 */
export const deleteUser = async (req, res) => {
  try {

    const [result] = await pool.query('delete from t_users where usr_id = ?', [req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "Usuario no encontrado" })

    res.status(200).json({})

  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar usuario',
      error
    })
  }
}