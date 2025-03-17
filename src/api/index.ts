export const api = {
  fetchMusic: async () => {
    const resp = await fetch('http://localhost:3000/musicMedia')
    const result = resp.json()

    return result
  }
}
