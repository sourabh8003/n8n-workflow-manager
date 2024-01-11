const config = () => {
  return {
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 8383,
    bodyParser: {
      jsonLimit: process.env.BODYPARSER_JSON_LIMIT || '10mb'
    },
  }
}
export default config()
