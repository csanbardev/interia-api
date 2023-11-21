import { pool } from "../db.js"

export const getLikes = async (req, res) => {
  try {
    const id_user = req.id_user
    const { id } = req.params

    const [rows] = await pool.query("select * from t_likes where lks_tut_id=? and lks_usr_id=?", [id, id_user])

    if (rows.length <= 0) return res.status(404).json({ message: 'La entrada no tiene likes' })

    res.json(rows)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener likes',
      error
    })
  }
}

export const addLikes = async(id_tutorial, id_user) => {
  try {
    
    const[rows] = await pool.query("insert into t_likes (lks_tut_id, lks_usr_id) values (?,?)", [id_tutorial, id_user])

    if (rows.length <= 0) throw Error("No se ha añadido like")
    
    return
  } catch (error) {
    throw error
    
  }
}

export const deleteLikes = async(id_tutorial, id_user) => {
  try {
    
    const[rows] = await pool.query("delete from t_likes where lks_usr_id=? and lks_tut_id=?", [id_user, id_tutorial])

    if (rows.length <= 0) throw Error("No se ha eliminado like")

    return
  } catch (error) {
    throw error
  }
}