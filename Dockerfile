# Use lightweight nginx image
FROM nginx:alpine

# Copy all application files to nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Nginx runs automatically in the foreground
