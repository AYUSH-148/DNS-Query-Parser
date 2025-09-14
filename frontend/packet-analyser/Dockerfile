# --- Stage 1: Build the React App ---
    FROM node:18 as build

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the app's source code
    COPY . .
    
    # Build the app for production
    RUN npm run build
    
    # --- Stage 2: Serve the App with Nginx ---
    FROM nginx:stable-alpine
    
    # Copy the built files from the 'build' stage to the Nginx server directory
    COPY --from=build /app/build /usr/share/nginx/html
    
    EXPOSE 80