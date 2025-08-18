# Dockerfile

# 1. Use an official Node.js runtime as the base image
# Using alpine for a smaller image size
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of your application's source code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 4000

# 7. Define the command to run your application
CMD [ "npm", "start" ]
