from node:20-alpine as server-builder

WORKDIR /app

COPY server/ /app/

RUN npm ci
RUN npm run build

from node:20-alpine as web-builder

WORKDIR /app

COPY web/ /app/

RUN npm ci
RUN npm run build

from node:20-alpine

RUN addgroup -S container && adduser -S container -G container
USER container
EXPOSE 8080

WORKDIR /app

COPY --chown=container:container --from=server-builder /app/package.json /app/package-lock.json /app/dist/ /app/server/
COPY --chown=container:container --from=web-builder /app/dist/ /app/web/

RUN cd server && npm install --omit=dev

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "server/main.js"]
