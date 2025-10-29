package main

import (
	"github.com/gin-gonic/gin"
	//"graduation_invitation/config"
	//"graduation_invitation/routes"
)

func main() {
	// Connect DB
	//config.ConnectDB()

	// Setup router
	r := gin.Default()

	// Serve static files
	r.Static("/assets", "./views/assets")
	r.Static("/css", "./views/css")
	r.Static("/js", "./views/js")

	// Serve HTML pages
	r.StaticFile("/", "./views/index.html")      // Thiệp mời
	r.StaticFile("/admin", "./views/admin.html") // Admin

	// API routes
	//routes.SetupRoutes(r)

	// Run
	r.Run(":8080")
}
