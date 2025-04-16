export const api = {
  fetchMusic: async () => {
    const resp = await fetch(`${process.env.LOCAL_API_URL}/musicMedia`)
    const result = resp.json()

    return result
  },

  fetchVideos: async () => {
    const result = await fetch(`${process.env.LOCAL_API_URL}/videos`)
    const data = await result.json()

    return data.length > 0 ? data : []
  }
}
