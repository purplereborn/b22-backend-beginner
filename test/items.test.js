const sinon = require('sinon')
const {APP_URL} = process.env
const {getItems} = require('../src/controllers/items')
const supertest = require('supertest')
const {expect, should, assert} = require('chai')

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Get Items test', ()=>{
    
  it(`get Item success`, (done) => {

    let req = {
      query: {
        search: 'vie'
      }
    }
    const res = mockingResponse()
    getItems(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('Item list')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  // it(`get History Not Found`, (done) => {

  //   let req = {
  //     authUser: {
  //       id: 200
  //     }
  //   }
  //   const res = mockingResponse()
  //   historyTransaction(req,res).then((data) => {
  //       expect(data.json.args[0][0].success).to.be.false
  //       expect(data.status.args[0][0]).equal(500)
  //       expect(data.json.args[0][0].message).equal('History Transactions not found')
  //       // console.log(data.json.args)
  //       done()
  //     }).catch((err) => {
  //       done(err)
  //     })

  // })



})