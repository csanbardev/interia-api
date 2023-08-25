import { pool } from "../db.js";

export const getReportedTutorials = async (req, res) => {
  try {

  } catch (error) {

  }
}


export const createReport = async (req, res) => {
  try {
    const { id } = req.params


    const [rows] = await pool.query('insert into reports (id_tutorial, id_user) values(?, ?)', [id, req.id_user])

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al generar reporte',
      error: error.toString()
    })
  }
}