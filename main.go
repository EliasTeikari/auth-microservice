package main

import "github.com/gin-gonic/gin"
import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// check if env has url set, fallback localhost:8000
	_ = godotenv.Load()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

    router := gin.Default()
	log.Println("Server running on port:", port)
	
    router.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Auth microservice running!"})
    })

    router.Run(.env)
}