import { createTransport } from "nodemailer"

/**
 * Receive data to send in an email
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const sendEmail = async (req, res) => {
  try {
    const { name, email, asunto, mensaje } = req.body
    const config = {
      host: 'smtp.office365.com',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_KEY
      }
    }

    const mail = {
      from: process.env.EMAIL,
      to: 'csanbar97@gmail.com',
      subject: `${asunto}`,
      html: `${returnMessage(name, email, mensaje)}`
    }

    const transport = createTransport(config)

    const info = await transport.sendMail(mail)

    res.status(200).json({})

  } catch (error) {
    res.status(500).json({
      error
    })
  }

}

/**
 * Parse to HTML format data to send in email
 * @param {*} name 
 * @param {*} email 
 * @param {*} mensaje 
 * @returns 
 */
const returnMessage = (name, email, mensaje) => {
  return `
  <html>
      <body>
        <h2>Autor: ${name}</h2>
        <h3>Correo de contacto: ${email}</h3>
        <p>Mensaje: ${mensaje}</p>
      </body>
    </html>
  
  `
}