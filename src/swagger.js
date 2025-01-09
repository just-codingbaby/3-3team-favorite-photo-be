import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: '최애의포토 API',
    description: '풀스택 중급 프로젝트',
  },
  servers: [
    {
      url: 'http://localhost:8000/api/v1',
    },
  ],
  tags: [
    {
      name: 'Shop',
      description: '',
    },
    {
      name: 'Auth',
      description: '',
    },
  ],
  components: {},
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(async () => {
  await import('./app.js');
});