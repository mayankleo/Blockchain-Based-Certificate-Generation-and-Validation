# Stage 1: Backend
FROM node:20.14 AS backend
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./
EXPOSE 5000

# Stage 2: Blockchain
FROM node:20.14 AS blockchain
WORKDIR /app/blockchain
COPY blockchain/package.json ./
RUN npm install
COPY blockchain/ ./
EXPOSE 8545

# Stage 3: Frontend
FROM node:20.14 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
EXPOSE 5173

# Final Stage: Combine all services
FROM node:20.14
WORKDIR /app
COPY --from=backend /app/backend ./backend
COPY --from=blockchain /app/blockchain ./blockchain
COPY --from=frontend /app/frontend ./frontend


COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]

