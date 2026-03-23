import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE || ''

const client = axios.create({
  baseURL: apiBase,
})

export async function uploadReference(imageFiles) {
  const form = new FormData()
  imageFiles.forEach((file) => form.append("images", file))
  const { data } = await client.post('/api/vision/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function generateCopy(payload) {
  const { data } = await client.post('/api/copy/generate', payload)
  return data
}

export async function approveCopy(copy) {
  const { data } = await client.post('/api/copy/approve', { copy })
  return data
}

export async function generateImages(payload) {
  const { data } = await client.post('/api/images/generate', payload)
  return data
}

export async function generateAiImage(prompt) {
  const { data } = await client.post('/api/images/generate-ai', { prompt })
  return data
}

export default client


