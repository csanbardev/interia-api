import jest from 'jest'
import app from '../src/app'
import request from 'supertest'



describe('GET /users', () => {
  test('should respond with a 200 status code', async () => {
    await process.nextTick(() => {}); // a magic trick to solve openhandles warnings

    const response = await request(app).get('/users').auth(process.env.ADMIN_TOKEN, { type: 'bearer' }).send()
    expect(response.statusCode).toBe(200)

  })

  test("should respond with a 401 status code", async () => {
    const response = await request(app).get('/users').send()
    expect(response.statusCode).toBe(401)
  })

  test("content-type shoud be application/json", async () => {
    const response = await request(app).get('/users').send()
    expect(response.header['content-type']).toEqual(expect.stringContaining("json"))
  })

})

describe("GET /users/:id", () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/users/14').auth(process.env.ADMIN_TOKEN, { type: 'bearer' }).send()
    expect(response.statusCode).toBe(200)
  })

  test('user does not exist => 404 status code', async() =>{
    const response = await request(app).get('/users/100000').auth(process.env.ADMIN_TOKEN, { type: 'bearer' }).send()
    expect(response.statusCode).toBe(404)
  })

  describe('user without permission', () => {
    test('should respond with a 401 status code', async () => {
      const response = await request(app).get('/users/1').auth(process.env.USER_TOKEN, { type: 'bearer' }).send()
      expect(response.statusCode).toBe(401)
    })
  })
})

describe('POST /users', () => {
  test('should respond with a 200 status code', async () => {
    const randomNick = Date.parse(new Date())
    const response = await request(app).post('/users').send({
      nick: randomNick,
      password: "42",
      email: "user@mail.com",
      role: "admin"
    })
    expect(response.statusCode).toBe(200)
  })

  describe('duplicated data in table', () => {

    test('should respond with a 500 status code', async () => {
      const response = await request(app).post('/users').send({
        nick: "test", // already exist
        password: "42",
        email: "user@mail.com",
        role: "admin"
      })
      expect(response.statusCode).toBe(500)
    })
  })


  describe('partial data given to users', () => {

    test('none nick: should respond with a 403 status code', async () => {
      const response = await request(app).post('/users').send({
        password: "42",
        email: "user@mail.com",
        role: "admin"
      })
      expect(response.statusCode).toBe(403)
    })

    test('no valid nick: should respond with a 403 status code', async () => {
      const response = await request(app).post('/users').send({
        nick: "qwertyuiopñlkjhgw", // max length = 16
        password: "42",
        email: "user@mail.com",
        role: "admin"
      })
      expect(response.statusCode).toBe(403)
    })

    test('no valid email: should respond with a 403 status code', async () => {
      const randomNick = Date.parse(new Date())

      const response = await request(app).post('/users').send({
        nick: randomNick,
        password: "42",
        email: "usermail.com", // email format wrong
        role: "admin"
      })
      expect(response.statusCode).toBe(403)
    })
  })

})

describe("PATCH /users/:id", () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).patch('/users/14').auth(process.env.ADMIN_TOKEN, { type: 'bearer' }).send({
      email: "test@mail.com",
    })
    expect(response.statusCode).toBe(200)
  })

  describe('access control to patch role', () => {
    test('user role: should respond with a 401 status code', async () => {
      const response = await request(app).patch('/users/14').auth(process.env.USER_TOKEN, { type: 'bearer' }).send({
        email: "test@mail.com",
      })

      expect(response.statusCode).toBe(401)
    })
  })

})

describe("DELETE /users/:id", () => {

})