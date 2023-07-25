import { pool } from "../db.js"


/**
 * Get a list of categories
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JSON with tutorials or an error
 */
export const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("select * from categories where pending=1")

    if (rows.lenght <= 0) return res.status(404).json({ message: 'No hay categorías disponibles' })

    res.json(rows)
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

    const [result] = await pool.query('delete from categories where id = ?', [req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "Categoría no encontrada" })

    res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar categoría',
      error
    })
  }
}