import { Hono } from 'hono'
import jobsRouter from './features/jobs/jobs.routes'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/jobs', jobsRouter)

export default app
