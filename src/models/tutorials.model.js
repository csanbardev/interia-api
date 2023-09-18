import { pool } from "../db.js"

/**
 * Get an array of ID an return all tutorials with those IDs
 * 
 * @param {Array} id - an array with id_tutorials
 * @returns 
 */
export const getTutorialsById = async(id) => {
  try {
    const placeholders = id.map(() => '?').join(',')
    const query = `select * from tutorials where id_tutorial in (${placeholders})`
    const [rows] = await pool.query(query, id)

    if (rows.length <= 0) throw Error('El tutorial no existe')

    return rows
    
  } catch (error) {
    throw error
  }
}