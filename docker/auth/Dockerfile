FROM node:20-alpine
WORKDIR /app
COPY docker/auth/server.js ./server.js
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
