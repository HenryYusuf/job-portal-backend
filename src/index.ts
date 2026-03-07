import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { jobsRouter } from './features/jobs/jobs.routes';
import { sendError } from './lib/api-response';

const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/jobs', jobsRouter);

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Job Portal API',
  },
});

// Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }));

// Global Error Handler
app.onError((err, c) => {
  console.error(`${err}`);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  return c.json(sendError(message), 500);
});

export { app };
