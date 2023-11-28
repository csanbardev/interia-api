import { pool } from "../db.js"
import pkg from 'jsonwebtoken'
import { extractYoutubeDate } from "../utils/dateUtils.js"
import { addLikes, deleteLikes } from "./likes.controller.js"


export const getLikesTutorials = async (req, res) => {
  try {
    const id_user = req.id_user

    // TODO: controll id_user===token.id or role===admin

    const [rows] = await pool.query("select * from t_tutorials t inner join t_likes l on t.tut_id= l.lks_tut_id and l.lks_usr_id=?", [id_user])

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
    const [rows] = await pool.query("select * from t_tutorials t inner join t_categories c on t.tut_cat_id = c.cat_id where tut_approved=0")

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales pendientes' })

    res.json(rows)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener tutoriales',
      error
    })
  }
}

export const getLimitedTutorials = async (req, res) => {
  try {
    const { order } = req.query
    const option = {
      recent: "tut_published_date",
      likest: "likes"
    }

    const query = `select count(distinct lks_usr_id) as likes, t.* from t_tutorials t left join t_likes on tut_id=lks_tut_id where t.tut_approved=1 group by tut_title order by ${option[order]} desc limit 6`
    const [rows] = await pool.query(query)

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales' })

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

    const [rows] = await pool.query("select * from t_tutorials t inner join t_categories c on t.tut_cat_id = c.cat_id where t.tut_usr_id=?", [id_user])

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
    const { category, page = 1, limit = 10 } = req.query

    if (category === undefined) {
      return res.status(404).json({ message: 'No has indicado la categoría' })
    }

    const offset = (page - 1) * limit

    const [rows] = await pool.query("select count(distinct lks_usr_id) as likes, t.* from t_tutorials t left join t_likes on tut_id=lks_tut_id where tut_cat_id=? and tut_approved=1 group by tut_title order by likes desc limit ? offset ?", [category, +limit, +offset])

    // select count(distinct lks_usr_id) as cant_likes from t_likes where lks_tut_id=?

    const [totalPageData] = await pool.query("select count(*) as count from t_tutorials where tut_cat_id=? and tut_approved=1", [category])

    const totalPages = Math.ceil(+totalPageData[0]?.count / limit)

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay tutoriales disponibles' })

    res.json({
      data: rows,
      pagination: {
        page: +page,
        limit: +limit,
        totalPages
      }
    })
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

    const [rows] = await pool.query("select * from t_tutorials t inner join t_categories c on t.tut__cat_id = c.cat_id where tut_id=?", [id])

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

    const { title, author, imageUrl, publishedDate, ybLikes, duration } = req.videoDetails

    const videoDate = extractYoutubeDate(publishedDate)

    const [rows] = await pool.query('insert into t_tutorials (tut_title, tut_author, tut_src_image, tut_url, tut_published_date, tut_cat_id, tut_usr_id, tut_approved, tut_length, tut_yb_likes) values (?,?,?,?,?,?,?,0,?,?)', [title, author, imageUrl, url, videoDate, id_category, req.id_user, duration, ybLikes])

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
      'update t_tutorials set tut_title = IFNULL(?, tut_title), tut_url = IFNULL(?, tut_url), tut_approved = IFNULL(?, tut_approved), tut_published_date = IFNULL(?, tut_published_date), tut_cat_id = IFNULL(?, tut_cat_id), tut_usr_id = IFNULL(?, tut_usr_id), tut_likes = IFNULL(?, tut_likes) where tut_id = ?',
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


    // let query = 'update t_tutorials set tut_likes = + 1 where tut_id = ?'
    if (likes < 0) {
      
      await deleteLikes(id, req.id_user)

    } else {
      await addLikes(id, req.id_user)
    }

    
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

    const [result] = await pool.query('delete from t_tutorials where tut_id = ?', [req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "Tutorial no encontrado" })

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar tutorial',
      error
    })
  }
}