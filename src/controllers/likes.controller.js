import { pool } from "../db.js"

/**
 * Return count of likes from one tutorial by his ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getLikes = async (req, res) => {
  try {

    const { id } = req.params

    const [rows] = await pool.query("select count(distinct lks_usr_id) as cant_likes from t_likes where lks_tut_id=?", [id])

    if (rows.length <= 0) return res.status(200).json({ cant_likes: 0 })

    res.status(200).json({
      cant_likes: rows[0].cant_likes
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener likes',
      code: error.code
    })
  }
}

/**
 * Check if some user had liked some tutorial
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const isLiked = async (req, res) => {
  try {
    const id_user = req.id_user
    const { id } = req.params

    const [rows] = await pool.query("select count(distinct lks_usr_id) as total from t_likes where lks_tut_id=? and lks_usr_id=?", [id, id_user])

    res.status(200).json({
      total: rows[0].total
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener likes',
      code: error.code
    })
  }
}

export const addLikes = async (id_tutorial, id_user) => {
  try {

    const [rows] = await pool.query("insert into t_likes (lks_tut_id, lks_usr_id) values (?,?)", [id_tutorial, id_user])

    if (rows.length <= 0) throw Error("No se ha añadido like")

    return
  } catch (error) {
    throw error

  }
}

export const deleteLikes = async (id_tutorial, id_user) => {
  try {

    const [rows] = await pool.query("delete from t_likes where lks_usr_id=? and lks_tut_id=?", [id_user, id_tutorial])

    if (rows.length <= 0) throw Error("No se ha eliminado like")

    return
  } catch (error) {
    throw error
  }
}