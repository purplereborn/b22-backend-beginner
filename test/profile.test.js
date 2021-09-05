const sinon = require('sinon')
const {APP_URL} = process.env
const {getUser,updateProfile,confirmPassword,updatePassword} = require('../src/controllers/profile')
const supertest = require('supertest')
const {expect, should, assert} = require('chai')

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Get Profile test', ()=>{
    
  it(`get Profile success`, (done) => {

    let req = {
      authUser: {
        id: 22
      }
    }
    const res = mockingResponse()
    getUser(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('Profile Detail')
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  it(`get Profile Not Found`, (done) => {

    let req = {
      authUser: {
        id: 16
      }
    }
    const res = mockingResponse()
    getUser(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(401)
        expect(data.json.args[0][0].message).equal('Profile Not found')
        done()
      }).catch((err) => {
        done(err)
      })

  })



})



describe('Update Profile test', ()=>{

it(`Update Profile : User not found`, (done) => {

  let req = {
    authUser: {
      id: 99
    }
  }
  const res = mockingResponse()
  updateProfile(req,res).then((data) => {
      expect(data.json.args[0][0].success).to.be.false
      expect(data.status.args[0][0]).equal(401)
      expect(data.json.args[0][0].message).equal('Profile Not found')
      done()
    }).catch((err) => {
      done(err)
    })

})

// it(`Update Profile : success`, (done) => {

//   const req = {
//     body: {
//       name: 'sandiiiii'
//     },
//     authUser: {   
//           id: 71  
//     }
//   }
//   const res = mockingResponse()
//   updateProfile(req,res).then((data) => {
//       expect(data.json.args[0][0].success).to.be.false
//       // expect(data.status.args[0][0]).equal(401)
//       // expect(data.json.args[0][0].message).equal('Profile Not found')
//       console.log(data.json.args)
//       // console.log(data.status.args)
//       done()
//     }).catch((err) => {
//       done(err)
//       // console.log(err)
//     })
//     // done()
// })

})

describe('Confirm password', ()=>{
    
  it(`Password validation`, (done) => {

    let req = {
      body: {
        password: '123456'
    },
      authUser: {
        id: 71
      }
    }
    const res = mockingResponse()
    confirmPassword(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.json.args[0][0].message).equal('password length must be greater than 7')
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  it(`User must be login`, (done) => {

    let req = {
      body: {
        password: '1234567'
    },
      authUser: {
        id: 99
      }
    }
    const res = mockingResponse()
    confirmPassword(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(401)
        expect(data.json.args[0][0].message).equal('An error occurred')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })

  it(`Confirm password success`, (done) => {

    let req = {
      body: {
        password: '12345678'
    },
      authUser: {
        id: 71
      }
    }
    const res = mockingResponse()
    confirmPassword(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        // expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('Password Verification success')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })

})


describe('Update password', ()=>{
    
  it(`Password validation`, (done) => {

    let req = {
      body: {
        password: '123456'
    },
      authUser: {
        id: 71
      }
    }
    const res = mockingResponse()
    updatePassword(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.json.args[0][0].message).equal('password length must be greater than 7')
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  it(`Old password and new password not match`, (done) => {

    let req = {
      body: {
        password: '1234567',
        resendPassword: '123456789'
    },
      authUser: {
        id: 71
      }
    }
    const res = mockingResponse()
    updatePassword(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        // expect(data.status.args[0][0]).equal(400)
        expect(data.json.args[0][0].message).equal('password not match')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })

  it(`Update password success`, (done) => {

    let req = {
      body: {
        password: '12345678',
        resendPassword: '12345678'
    },
      authUser: {
        id: 71
      }
    }
    const res = mockingResponse()
    updatePassword(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('Success update password')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })


})