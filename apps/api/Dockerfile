# Use the official Golang image as the base image
FROM golang:1.23-alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Install make
RUN apk add --no-cache make

# Install Goose 
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Build the Go app
RUN go build -o bin/api main.go

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the executable
CMD ["./bin/api"]