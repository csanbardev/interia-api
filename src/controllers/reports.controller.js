import { pool } from "../db.js";

export const getReportedTutorials = async (req, res) => {
  try {

  } catch (error) {

  }
}


export const createReport = async (req, res) => {
  try {
    const { id } = req.params

    if(await alreadyReported(id, req.id_user)){
      return res.status(401).json({})
    }

    const [rows] = await pool.query('insert into reports (id_tutorial, id_user) values(?, ?)', [id, req.id_user])

    res.status(200).json({})
  } catch (error) {
    return res.status(500).json({
      message: 'Error al generar reporte',
      error: error.toString()
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
async function alreadyReported(id_tutorial, id_user){

  const [rows] = await pool.query("select * from reports where id_tutorial = ? and id_user = ?", [id_tutorial, id_user])

  if(rows.length <= 0){
   return false
  }  

  return true
}