const sinon = require('sinon')
const {APP_URL} = process.env
const {login,register} = require('../src/controllers/auth')
const supertest = require('supertest')
const {expect, should, assert} = require('chai')

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

  // it('Wrong username or password', (done) => {
  //   supertest(APP_URL)
  //   .post('/auth/login')
  //   .send(`email=sandi&password=123456`)
  //   .expect(400)
  //   .end((err, res) => {
  //     expect(res.body.success).to.be.false
  //     expect(res.body.message).equal('Wrong username or password')
  //     done()
  //   })
  // })

  describe('Auth Login testing', ()=>{
    
    it(`password validation : False`, (done) => {
      let req = {
        body: {
          email: 'sandi',
          password: '123456'
        }
      }
      const res = mockingResponse()
        login(req,res).then((data) => {
          expect(data.json.args[0][0].success).to.be.false
          expect(data.status.args[0][0]).equal(400)
        }).catch((err) => {
          console.log(err)
        })
      done()
    })

    it('Email : False', (done) => {
      supertest(APP_URL)
      .post('/auth/login')
      .send(`email=sandiajah@gmail.com&password=12345678`)
      .expect(401)
      .end((err, res) => {
        expect(res.body.success).to.be.false
        expect(res.body.message).equal('Wrong username or password')
        done()
      })
    })

  })



  describe('Auth Register testing ', () => {

  
    it(`password validation : False`, (done) => {
      let req = {
        body: {
          email: 'sandi',
          password: '123456'
        }
      }
      const res = mockingResponse()
        register(req,res).then((data) => {
          expect(data.json.args[0][0].success).to.be.false
          expect(data.status.args[0][0]).equal(400)
        }).catch((err) => {
          console.log(err)
        })
      done()
    })

    it('Register : Success', (done) => {
    supertest(APP_URL)
    .post('/auth/register')
    .send(`email=sandiajah@email.com&password=12345678&number=012345678`)
    .expect(200)
    .end((err, res) => {
      expect(res.body.success).to.be.true
      expect(res.body.message).equal('Register Successfully')
      done()
    })
  })
    // it(`Register Successfully`, (done)=>{
    //   let req = {
    //     body: {
    //       email: 'sandi',
    //       password: '12345678'
    //     }
    //   }
    //   const mockingResponse2 = () => {
    //     const res = {}
    //     res.status = sinon.stub().returns(res)
    //     res.json = sinon.stub().returns(res)
    //     return res
    //   }
    //   const res = mockingResponse2()
    //   register(req,res).then((data) => {
    //   expect(data.json.args[0][0].success).to.be.true
    //   expect(data.status.args[0][0]).equal(200)
    // }).catch((err) => {
    //   console.log(err)
    // })

    //   done()
    // })
  
  })
  