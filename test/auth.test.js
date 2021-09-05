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
          expect(data.json.args[0][0].message).equal('password length must be greater than 7')
        }).catch((err) => {
          done(err)
        })
      done()
    })
    
      it(`Wrong Email`, (done)=>{
        let req = {
          body: {
            email: 'sansandidi',
            password: '12345678'
          }
        }
        const res = mockingResponse()
        login(req,res).then((data) => {
          expect(data.json.args[0][0].success).to.be.false
          expect(data.status.args[0][0]).equal(401)
          expect(data.json.args[0][0].message).equal('Email not found')
        }).catch((err) => {
          done(err)
        })
        done()
      })

      it(`Wrong Password`, (done)=>{
        let req = {
          body: {
            email: 'everyday@gmail.com',
            password: '1234567890'
          }
        }
        const res = mockingResponse()
        login(req,res).then((data) => {
          expect(data.json.args[0][0].success).to.be.false
          expect(data.status.args[0][0]).equal(401)
          expect(data.json.args[0][0].message).equal('Wrong email or password')
        }).catch((err) => {
          done(err)
        })
        done()
      })

      it(`Login Success`, (done)=>{
        let req = {
          body: {
            email: 'everyday@gmail.com',
            password: '12345678'
          }
        }
        const res = mockingResponse()
        login(req,res).then((data) => {
          expect(data.json.args[0][0].success).to.be.true
          expect(data.status.args[0][0]).equal(200)
          expect(data.json.args[0][0].message).equal('Login success')
        }).catch((err) => {
          done(err)
        })
        done()
      })

  //   it('Email : False', (done) => {
  //     supertest(APP_URL)
  //     .post('/auth/login')
  //     .send(`email=sandiajah@gmail.com&password=12345678`)
  //     .expect(401)
  //     .end((err, res) => {
  //       expect(res.body.success).to.be.false
  //       expect(res.body.message).equal('Wrong username or password')
  //       done()
  //     })
  //   })

  })



  describe('Auth Register testing ', () => {

  
    it(`password validation : False`, (done) => {
      let req = {
        body: {
          number:'0123456789',
          email: 'sandi',
          password: '123456'
        }
      }
      const res = mockingResponse()
        register(req,res).then((data) => {
          expect(data.json.args[0][0].success).to.be.false
          expect(data.status.args[0][0]).equal(400)
          expect(data.json.args[0][0].message).equal('password length must be greater than 7')
        }).catch((err) => {
          done(err)
        })
      done()
    })

  //   it('Register : Success', (done) => {
  //   supertest(APP_URL)
  //   .post('/auth/register')
  //   .send(`email=sandiajah@email.com&password=12345678&number=012345678`)
  //   .expect(200)
  //   .end((err, res) => {
  //     expect(res.body.success).to.be.true
  //     expect(res.body.message).equal('Register Successfully')
  //     done()
  //   })
  // })
    it(`Email is already in use`, (done)=>{
      let req = {
        body: {
          number:'0123456789',
          email: 'sandi1919@gmail.com',
          password: '12345678'
        }
      }
      const res = mockingResponse()
      register(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(400)
        expect(data.json.args[0][0].message).equal('Email is already in use')
    }).catch((err) => {
      done(err)
    })

      done()
  })


//   it(`Register Successfully`, (done)=>{
//     let req = {
//       body: {
//         number:'0123456789',
//         email: 'sandi677@gmail.com',
//         password: '12345678'
//       }
//     }
//     const res = mockingResponse()
//     register(req,res).then((data) => {
//       expect(data.json.args[0][0].success).to.be.true
//       expect(data.status.args[0][0]).equal(200)
//       expect(data.json.args[0][0].message).equal('Register Successfully')
//   }).catch((err) => {
//     done(err)
//   })

//     done()
// })
  
})
  