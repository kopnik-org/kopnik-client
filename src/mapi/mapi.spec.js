import {container} from "@/bottle/bottle";


describe('mapi', () => {
  const api = container.api
  it('string matcher', async () => {
    const handler= jest.fn()
    api.mock('some', handler)
    await api('for some and', 1)
    expect(handler).toBeCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('for some and', 1)
  })
  it('regexp matcher', async () => {
    const handler= jest.fn()
    api.mock(/some$/, handler)
    await api('for some', 1)
    expect(handler).toBeCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('for some', 1)
  })
  it.skip('transit', async () => {
    const result= await api('/api/not_fount')
    expect(result).toMatchObject({asf:1})
  })
})

