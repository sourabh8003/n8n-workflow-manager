import { Router, Request, Response, NextFunction  } from 'express'
import axios from 'axios'

const util = require('util')
const router = Router()

/**
 * API to accept the initial request
 */
router.get('/firstAPICall', (req: Request, res: Response) => {
  console.log('1:::: First API Call', util.inspect(req?.body, {showHidden: false, depth: null, colors: true}))
  return res.status(200).send({ next: true, data: { name: 'Sourabh' }});
})

/**
 * An another API to be able to invoke async call
 */
router.get('/secondAPICall', (req: Request, res: Response) => {
  console.log('2:::: Second API Call', util.inspect(req?.body, {showHidden: false, depth: null, colors: true}))
  return res.status(200).send({ status: 'OK' });
})


/**
 * This is a async API call
 * It require an execution ID from n8n to be able to invoke callback endpoint (Webhook) to resume the workflow
 */
let count = 1
router.get('/asyncAPICall', (req: Request, res: Response) => {
  console.log('3:::: Async API Call', 'COUNT::: ' + count, util.inspect(req?.query, {showHidden: false, depth: null, colors: true}))

  // Invoke an asynchronous function
  setTimeout(() => callBack(req.query.executionId), 20000);
  count++
  return res.status(200).send({data: 'wait & watch'});
})

/**
 * This API will be invoked to replicate the error scenarios
 */
router.get('/errorAPICall', (req: Request, res: Response, next: NextFunction) => {
  console.log('Error API Call', util.inspect(req?.body, {showHidden: false, depth: null, colors: true}))
  return res.status(500).send({data: 'Error occured while processing this request'});
})

/**
 * This API will be invoked once workflow is successfully completed
 */
router.get('/successAPICall', (req: Request, res: Response, next: NextFunction) => {
  console.log('Success API Call', util.inspect(req?.body, {showHidden: false, depth: null, colors: true}))
  return res.status(200).send({data: 'success'});
})

/*************************************************************************************************************
 * Webhook Executions
 *************************************************************************************************************/
const callBack = (exeId: any) => {
  console.log('Workflow execution id has been received ::====>', exeId)

  // Invoke n8n webhook to resume the workflow
  axios.post(`http://localhost:5678/webhook-waiting/${exeId}`, { message: 'Message from callback API'}).then((res: any) => {
    console.log('Async webhook triggered', res.data?.message)
  }).catch((error) => {
    console.log('Error from Webhook')
  })
}

export default router
