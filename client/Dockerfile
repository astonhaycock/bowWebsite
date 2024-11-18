# Use the Nginx base image to serve static files
FROM nginx:alpine

# Copy the static files into the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
