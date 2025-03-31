    FROM node:18-alpine

RUN mkdir -p /home/backend/app
RUN addgroup -S backend && adduser -S backend -G backend

WORKDIR /home/backend/app

COPY package*.json ./

RUN npm set strict-ssl false
RUN npm install -g @swc/cli @swc/core
RUN yarn install

COPY --chown=backend:backend . .

RUN npm run build

USER backend

EXPOSE 5000

CMD [ "npm","start" ]
