export const api = {
  fetchMusic: async () => {
    const resp = await fetch(`${process.env.BACKEND_HOST}/musicMedia`)
    const result = resp.json()

    return result
  },

  fetchVideos: async () => {
    const result = await fetch(`${process.env.BACKEND_HOST}/videos`)
    const data = result.json()

    return data
  }
}
