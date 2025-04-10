const getBoolEnvVariable = (key: string) => {
  const value = process.env[key]
  return value?.toLowerCase().trim() === "true"
}

const getEnvVariable = (key: string, defaultValue?: string) => {
  return process.env[key] ?? defaultValue
}

const getRequiredEnvVariable = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Required setting ${key} is not defined`)
  }
  return value
}

export const Settings = {
  getSwaggerEnabled: () => getBoolEnvVariable("SWAGGER_ENABLED"),
  getHttpPort: () => getEnvVariable("HTTP_PORT"),
  getOpenAiApiKey: () => getRequiredEnvVariable("OPENAI_API_KEY"),
  getPexelsApiKey: () => getRequiredEnvVariable("PEXELS_API_KEY"),
  getTwilioAccountSid: () => getEnvVariable("TWILIO_ACCOUNT_SID"),
  getTwilioAuthToken: () => getEnvVariable("TWILIO_AUTH_TOKEN"),
  getTwilioWhatsAppFrom: () => getEnvVariable("TWILIO_WHATSAPP_FROM"),
}
