import { pool } from "../db.js";
import { getTutorialsById } from "../models/tutorials.model.js";

export const getReportedTutorials = async (req, res) => {
  try {
    const [rows] = await pool.query('select rpt_tut_id from t_reports')
    const tutorials = new Array()
    if (rows.length <= 0) res.status(404).json({})

    rows.forEach(t => tutorials.push(t.rpt_tut_id))
    const tutos = await getTutorialsById(tutorials)

    res.json(tutos)

  } catch (error) {
    return res.status(500).json({
      message: 'Error al mostrar reportes',
      error: error.toString()
    })
  }
}


export const createReport = async (req, res) => {
  try {
    const { id } = req.params

    if (await alreadyReported(id, req.id_user)) {
      return res.status(401).json({})
    }

    const [rows] = await pool.query('insert into t_reports (rpt_tut_id, rpt_tut_id) values(?, ?)', [id, req.id_user])

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al generar reporte',
      error: error.toString()
    })
  }
}

export const deleteReport = async (req, res) => {
  try {
    const [result] = await pool.query('delete from t_reports where rpt_tut_id = ?', [req.params.id])

    if (result.affectedRows === 0) return res.status(404).json({ "message": "Tutorial no encontrado" })

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar reporte',
      error
    })
  }
}

/**
 * Checks if a tutorial was already reported by the selected user
 * 
 * 
 * @param {*} id_tutorial 
 * @param {*} id_user 
 * @returns true or false
 */
async function alreadyReported(id_tutorial, id_user) {

  const [rows] = await pool.query("select * from t_reports where rpt_tut_id = ? and rpt_usr_id = ?", [id_tutorial, id_user])

  if (rows.length <= 0) {
    return false
  }

  return true
}