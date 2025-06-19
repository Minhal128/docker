FROM node:20-alpine

WORKDIR /app

# Copy and install backend dependencies
COPY backend ./backend
WORKDIR /app/backend
RUN npm install

# Copy and install frontend dependencies
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install

# Use a process manager to run both (for dev only)
WORKDIR /app
RUN npm install -g concurrently

CMD ["concurrently", "npm --prefix ./backend start", "npm --prefix ./frontend run dev"]
