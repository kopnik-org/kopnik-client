import mockIf from "@/mapi/fetchMockIf";
import {KopnikApiError} from "@/KopnikError";

describe('mockIf', () => {
  it('mock body', async () => {
    const init= {
      method: "POST",
      body:JSON.stringify({a:'567'})
    }
    mockIf(/test/, 1234)
    const response= await fetch('some test url', init)

    expect((await response.json()).response).toBe(1234)
    expect(fetch.mock.calls[0][0]).toBe('some test url')
    expect(fetch.mock.calls[0][1]).toEqual(init)
  })
  it('mock function', async () => {
    const init= {
      method: "POST",
      body:JSON.stringify({a:'567'})
    }
    mockIf(/test/, async req=>{
      return JSON.parse(req.body.toString())
    })
    const response= await fetch('some test url', init)
    const body= await response.json()

    expect(body.response).toEqual(JSON.parse(init.body))
  })

  it('combine mocks', async () => {
    mockIf(/test_1/, 1234)
    mockIf(/test_2/, 5678)
    const response1= await fetch('test_1')
    const response2=await fetch('test_2')
    expect((await response1.json()).response).toBe(1234)
    expect((await response2.json()).response).toBe(5678)
  })
  it.only('error', async () => {
    mockIf(/wrong/, new KopnikApiError('Message',1, 'url'))
    const response=await fetch('wrong')
    expect((await response.json()).error).toEqual({
      code: 1,
      message: "Message"
    })
  })


})

