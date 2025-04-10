import { Settings } from "@/settings"

export const searchPexelPicture = async (query: string) => {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
    {
      headers: {
        Authorization: Settings.getPexelsApiKey(),
      },
    }
  )
  const data = await response.json()
  return data.photos.length
    ? {
        url: data.photos[0].src.original,
        photographer: data.photos[0].photographer,
        alt: data.photos[0].alt,
      }
    : undefined
}
