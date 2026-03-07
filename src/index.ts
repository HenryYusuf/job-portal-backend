import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { jobsRouter } from './features/jobs/jobs.routes';

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
  return c.json(
    {
      success: false,
      error: err instanceof Error ? err.message : 'Internal Server Error',
    },
    500
  );
});

export { app };
