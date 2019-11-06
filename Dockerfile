# Define the image will use and version
FROM node:8

# Create an app directory to hold the application code and bundle
RUN mkdir /docker
COPY . /docker/
WORKDIR /docker

# Duplicate the dependency file to the container's project root directory.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Expose our app port inside the app and
EXPOSE 3000:3000

# Define commands that will run the app
CMD ["npm", "start"]
