import { trimEnd, trimStart } from "@/lib/utils"

export const Settings = {
  backend: {
    endpoint:
      process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || "http://localhost:3999",
  },
}

export const buildBackendUrl = (path: string) => {
  return `${trimEnd(Settings.backend.endpoint, "/")}/${trimStart(path, "/")}`
}
