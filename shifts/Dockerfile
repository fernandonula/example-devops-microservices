FROM node:16
WORKDIR '/app'
COPY 'src/package.json' .
RUN npm install
COPY src .

ENV ENV_NAME prod

RUN npm install typescript
RUN npx tsc

CMD ["node", "./dist/index.js"]