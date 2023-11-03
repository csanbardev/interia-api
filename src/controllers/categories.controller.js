import { pool } from "../db.js"





export const getPendingCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("select * from categories where pending=0")

    if (rows.length <= 0) return res.status(404).json({ message: 'No hay categorías pendientes' })

    res.json(rows)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener categorías',
      error
    })
  }
}

export const toApproveCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const avatar = req.file.path

    if (!req.file) {
      return res.status(400).json({ "message": 'No se ha dado una imagen de categoría' })
    }

    const [result] = await pool.query(
      'update categories set category_img = IFNULL(?, category_img), name = IFNULL(?, name), pending=1 where id_category=?',
      [avatar, name, id]
    )

    if (result.length <= 0) return res.status(404).json({ "message": "No se ha encontrado la categoría" })

    return res.status(200).json({})


  } catch (error) {
    return res.status(500).json({
      message: 'Error al aprobar categoría',
      error
    })
  }
}


/**
 * Get a list of categories
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON with tutorials or an error
 */
export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 8, name="" } = req.query
    const offset = (page - 1) * limit
    const params = name !== "" ? [name, +limit, +offset] : [+limit, +offset];


    const [rows] = await pool.query(`select * from categories where pending=1 ${name===""? '':'and name like ?'} limit ? offset ?`, params)

    const [totalPageData] = await pool.query(`select count(*) as count from categories where pending = 1 ${name===""? '':'and name like ?'}`, [name])
    const totalPages = Math.ceil(+totalPageData[0]?.count / limit)

    if (rows.lenght <= 0) return res.status(404).json({ message: 'No hay categorías disponibles' })

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
      message: 'Error al obtener categorías',
      error
    })
  }
}

export const getAllCategoriesFull = async (req, res) => {
  try {
    const [rows] = await pool.query('select * from categories where pending=1')
    if (rows.lenght <= 0) return res.status(404).json({ message: 'No hay categorías disponibles' })

    res.json(rows)
    
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener categorías',
      error
    })
  }
}

export const getCategoriesByName = async (req, res) => {
  try {
    const { page = 1, limit = 8, name="" } = req.query
    const offset = (page - 1) * limit


    const [rows] = await pool.query("select * from categories where pending=1 and name like ? limit ? offset ?", [name,+limit, +offset])

    const [totalPageData] = await pool.query("select count(*) as count from categories where pending = 1 and name like ?", [name])
    const totalPages = Math.ceil(+totalPageData[0]?.count / limit)

    if (rows.lenght <= 0) return res.status(404).json({ message: 'No hay categorías disponibles' })

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
      message: 'Error al obtener categorías',
      error
    })
  }
}

/**
 * Get all data from a given category
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const getCategory = async (req, res) => {
  try {
    const [rows] = await pool.query("select * from categories id_category=?", [req.params.id_category])

    if (rows.lenght <= 0) return res.status(404).json({ message: 'La categoría no existe' })

    res.json(rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener categoría',
      error
    })
  }
}


/**
 * Insert a new category into database 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 or an error 
 */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    const [rows] = await pool.query('insert into categories ( name, pending ) values (?, 0)', [name])

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al insertar categoría',
      error
    })
  }
}

/**
 * Update from a certain category 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns status 200 or an error
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  try {
    const [result] = await pool.query(
      'update categories set \
        name = IFNULL(?, name) \
          where id_category = ?',
      [id, name])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "No se ha encontrado la categoría" })

    res.sendStatus(200)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar categoría',
      error
    })
  }

}

/**
 * Delete a certain category 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 2004 or an error
 */
export const deleteCategory = async (req, res) => {
  try {

    const [result] = await pool.query('delete from categories where id_category = ?', [req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "Categoría no encontrada" })

    res.status(200).json({})

  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar categoría',
      error
    })
  }
}