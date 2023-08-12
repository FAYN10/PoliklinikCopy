FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN npm install
RUN npx next build

CMD ["npx", "next", "start"]