import jest from 'jest'
import app from '../src/app'
import request from 'supertest'
import moment from 'moment/moment'


describe('GET tutorials', () => {
  test('should respond with a 200 status code', async () => {
    await process.nextTick(() => {});
    
    const response = await request(app).get('/tutorials?category=1').send()
    const resApproved = JSON.parse(response.text)[0].approved


    expect(response.statusCode).toBe(200)
    expect(resApproved).toBe("0")

  })

  
})


describe('GET tutorials:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get('/tutorials/1').send()

    expect(response.statusCode).toBe(200)
  })
})

describe('POST tutorials', () => {
  test('should respond with a 200 status code', async () => {
    const randomUrl = Date.parse(new Date())
    const defaulDate = new Date()
    let a = new moment()
    const response = await request(app).post('/tutorials').auth(process.env.USER_TOKEN, { type: 'bearer' }).send({
      title: "creando",
      description: "descripcion",
      url: randomUrl,
      published_date: moment().format('YYYY-M-D'),
      id_category: 1,
    })
    expect(response.statusCode).toBe(200)
  })
})

describe('PATCH tutorials:id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).patch('/tutorials/1').auth(process.env.ADMIN_TOKEN, { type: 'bearer' }).send({
      likes: "3",
    })
    expect(response.statusCode).toBe(200)
  })
})



