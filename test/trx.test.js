const sinon = require('sinon')
const {APP_URL} = process.env
const {historyTransaction,createTransactions,deleteHistory} = require('../src/controllers/transactions')
const supertest = require('supertest')
const {expect, should, assert} = require('chai')

const mockingResponse = () => {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Get History test', ()=>{
    
  it(`get History success`, (done) => {

    let req = {
      authUser: {
        id: 14
      }
    }
    const res = mockingResponse()
    historyTransaction(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('History Transactions')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  it(`get History Not Found`, (done) => {

    let req = {
      authUser: {
        id: 200
      }
    }
    const res = mockingResponse()
    historyTransaction(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(500)
        expect(data.json.args[0][0].message).equal('History Transactions not found')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })



})


describe('Create Transaction test', ()=>{
    
  it(`Transaction success`, (done) => {

    let req = {
      body: {
        item_id: '3',
        item_amount:'3',
        item_additional_price:'1000',
        payment_method:'test'
    },
      authUser: {
        id: 22
      }
    }
    const res = mockingResponse()
    createTransactions(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('transaction successfully created')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  it(`Transaction failed cannot get id items`, (done) => {

    let req = {
      body: {
        item_id: '99',
        item_amount:'3',
        item_additional_price:'1000',
        payment_method:'test'
    },
      authUser: {
        id: 22
      }
    }
    const res = mockingResponse()
    createTransactions(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(404)
        expect(data.json.args[0][0].message).equal('id item not found')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })

  it(`Transaction failed cannot get id users`, (done) => {

    let req = {
      body: {
        item_id: '3',
        item_amount:'3',
        item_additional_price:'1000',
        payment_method:'test'
    },
      authUser: {
        id: 200
      }
    }
    const res = mockingResponse()
    createTransactions(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(404)
        expect(data.json.args[0][0].message).equal('User not found')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })

  it(`Transaction failed because empty of address`, (done) => {

    let req = {
      body: {
        item_id: '3',
        item_amount:'3',
        item_additional_price:'1000',
        payment_method:'test'
    },
      authUser: {
        id: 21
      }
    }
    const res = mockingResponse()
    createTransactions(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(400)
        expect(data.json.args[0][0].message).equal('you must complete the address data')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })

  // it(`Transaction > 1 success`, (done) => {

  //   let req = {
  //     body: {
  //       item_id:  [3,13],
  //       item_amount:[5,2],
  //       item_additional_price:'1000',
  //       payment_method:'test'
  //   },
  //     authUser: {
  //       id: 22
  //     }
  //   }
  //   const res = mockingResponse()
  //   createTransactions(req,res).then((data) => {
  //       // expect(data.json.args[0][0].success).to.be.true
  //       // expect(data.status.args[0][0]).equal(200)
  //       // expect(data.json.args[0][0].message).equal('transaction successfully created')
  //       console.log(data.json.args)
  //       done()
  //     }).catch((err) => {
  //       done(err)
  //     })

  // })

})

describe('Delete History test', ()=>{
    
  it(`delete History success`, (done) => {

    let req = {
      authUser: {
        id: 22
      }
    }
    const res = mockingResponse()
    deleteHistory(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.true
        expect(data.status.args[0][0]).equal(200)
        expect(data.json.args[0][0].message).equal('history has been deleted!')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })
  

  it(`delete History failed because history is empty`, (done) => {

    let req = {
      authUser: {
        id: 40
      }
    }
    const res = mockingResponse()
    deleteHistory(req,res).then((data) => {
        expect(data.json.args[0][0].success).to.be.false
        expect(data.status.args[0][0]).equal(404)
        expect(data.json.args[0][0].message).equal('history not found!')
        // console.log(data.json.args)
        done()
      }).catch((err) => {
        done(err)
      })

  })



})