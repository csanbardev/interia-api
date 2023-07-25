import pkg from 'jsonwebtoken'

export const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null
  let decodedToken = null



  try {
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.split(' ')[1]
      decodedToken = pkg.verify(token, process.env.SECRET)
    }

    if (!token || !decodedToken.id_user) {
      return res.status(401).json({ message: 'token no válido' })
    }

    req.id_user = decodedToken.id_user
    req.who = decodedToken.role
  } catch (error) {
    return res.status(401).json({ message: 'error al recibir el token' })

  }



  next()
}

export const adminAccess = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null
  let decodedToken = null
  try {
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.split(' ')[1]
      decodedToken = pkg.verify(token, process.env.SECRET)
    }


    if (!token || !decodedToken.id_user || decodedToken.role !== "admin") {
      return res.status(401).json({ message: 'token no válido', rol: decodedToken })
    }

    req.id_user = decodedToken.id_user
    req.who = decodedToken.role
  } catch (error) {
    return res.status(401).json({ message: 'error al recibir el token' })

  }

  next()
}