import { pool } from "../db.js"
import pkg from 'jsonwebtoken'
import { extractYoutubeDate } from "../utils/dateUtils.js"
import { addLikes, deleteLikes } from "./likes.controller.js"


export const getLikesTutorials = async (req, res) => {
  try {
    const id_user = req.id_user

    // TODO: controll id_user===token.id or role===admin

    const [rows] = await pool.query("select * from tutorials t inner join likes l on t.id_tutorial= l.id_tutorial and l.id_user=?", [id_user])

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales' })

    res.json(rows)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tutoriales',
      error
    })
  }
}

export const getPendingTutorials = async (req, res) => {
  try {
    const [rows] = await pool.query("select * from tutorials t inner join categories c on t.id_category = c.id_category where approved=1")

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales pendientes' })

    res.json(rows)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tutoriales',
      error
    })
  }
}


/**
 * Get a list of tutorials from a certain user
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON with tutorials
 */
export const getAllUserTutorials = async (req, res) => {
  try {
    const id_user = req.id_user

    if (id_user === undefined) {
      res.status(404).json({ message: 'No has indicado el usuario' })
    }

    const [rows] = await pool.query("select * from tutorials t inner join categories c on t.id_category = c.id_category where t.id_user=?", [id_user])

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales disponibles' })

    res.json(rows)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tutoriales',
      error
    })
  }
}

/**
 * Get a list of tutorials from a category
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON with tutorials or an error
 */
export const getAllTutorials = async (req, res) => {
  try {
    const { category } = req.query

    if (category === undefined) {
      return res.status(404).json({ message: 'No has indicado la categoría' })
    }

    const [rows] = await pool.query("select * from tutorials where id_category=? and approved=0", [category])

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales disponibles' })

    res.json(rows)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tutoriales',
      error
    })
  }
}

/**
 * Get all data from a given tutorial, including category data
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const getTutorial = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await pool.query("select * from tutorials t inner join categories c on t.id_category = c.id_category where id_tutorial=?", [id])

    if (rows.length <= 0) return res.status(404).json({ message: 'El tutorial no existe' })

    res.json(rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tutorial',
      error
    })
  }
}


/**
 * Insert a new tutorial into database. By default, approved is 0 and likes is 0
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 or an error 
 */
export const createTutorial = async (req, res) => {
  try {
    const { url, id_category } = req.body

    const { title, author, imageUrl, publishedDate } = req.videoDetails

    const videoDate = extractYoutubeDate(publishedDate)

    const [rows] = await pool.query('insert into tutorials (title, author, src_image, url, published_date, id_category, id_user, approved) values (?,?,?,?,?,?,?,1)', [title, author, imageUrl, url, videoDate, id_category, req.id_user])

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al proponer tutorial',
      error: error.toString()
    })
  }
}

/**
 * Update from a certain tutorial 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 or an error
 */
export const updateTutorial = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, url, approved, published_date, id_category, id_user, likes } = req.body

    if (approved !== null && req.who !== 'admin') {
      return res.status(501).json({ "message": "No tienes permiso para hacer eso" })
    }

    const [result] = await pool.query(
      'update tutorials set title = IFNULL(?, title), url = IFNULL(?, url), approved = IFNULL(?, approved), published_date = IFNULL(?, published_date), id_category = IFNULL(?, id_category), id_user = IFNULL(?, id_user), likes = IFNULL(?, likes) where id_tutorial = ?',
      [title, url, approved, published_date, id_category, id_user, likes, id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "No se ha encontrado el tutorial" })

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar tutorial',
      error
    })
  }

}

export const likeTutorial = async (req, res) => {
  try {
    const { id } = req.params
    const { likes } = req.body


    let query = 'update tutorials set likes = + 1 where id_tutorial = ?'
    if (likes < 0) {
      query = 'update tutorials set likes = - 1 where id_tutorial = ?'
      await deleteLikes(id, req.id_user)

    }else{
      await addLikes(id, req.id_user)
    }

    const [result] = await pool.query(query, [id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "No se ha encontrado el tutorial" })

    res.status(200).json({})

  } catch (error) {
    return res.status(500).json({
      message: 'Error al dar like al tutorial',
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
export const deleteTutorial = async (req, res) => {
  try {

    const [result] = await pool.query('delete from tutorials where id = ?', [req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "Tutorial no encontrado" })

    res.status(204).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar tutorial',
      error
    })
  }
}