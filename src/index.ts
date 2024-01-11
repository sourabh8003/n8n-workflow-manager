'use strict'

// 🙏 Welcome

import express, { Application, Request, Response } from 'express'
import http from 'http'
import compression from 'compression'
import bodyParser from 'body-parser'
import config from './config'
import asyncWorkFlowRoutes from './apis/async-workflow'

const {
  host,
  port,
   bodyParser: { jsonLimit }
} = config
const ngrok = require('ngrok')
const nodemon = require('nodemon')

// Initialize express app
const app: Application = express()

// Create HTTP server
const server = http.createServer(app)

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit: jsonLimit }))


app.get('/api/healthcheck', (req:Request, res: Response) => {
  return res.status(200).json({ data: 'Healthy'})
})

app.use('/api', asyncWorkFlowRoutes)


process.on('unhandledRejection', (reason: any, promise: any) => {
  console.log('Global unhandledRejection Handler', reason.stack)
})
process.on('uncaughtException', (e: any) => {
  console.log('Global uncaughtException Handler', e)
  process.exit(1)
})
server.listen(port, host, () => {
  console.log('Workflow manager demo app is up and running', { host, port })
})

ngrok.connect({
  proto : 'http',
  addr : port,
}).then((url: string, ...rest: any) => {
  console.log(`ngrok tunnel can be accessed at: ${url}`);
  console.log("ngrok dashboard can be accessed at: localhost:4040\n");
}).catch((error: any) => {
    console.error("Error opening ngrok tunnel: ", error);
    process.exitCode = 1;
});
