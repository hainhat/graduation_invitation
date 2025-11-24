package main

import (
	"graduation_invitation/backend/config"
	"graduation_invitation/backend/models"
	"graduation_invitation/backend/routes"
	"graduation_invitation/backend/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.ConnectDB()

	r := gin.Default()

	//r.Static("/", "./frontend")
	//// Static files
	//r.Static("/css", "./frontend/static/css")
	//r.Static("/js", "./frontend/static/js")

	r.Static(("/css"), "frontend/static/css")
	r.Static(("/js"), "frontend/static/js")
	// Render with partials
	r.GET("/", func(c *gin.Context) {
		utils.RenderHTMLWithPartials(c, "./frontend/index.html")
	})
	r.GET("/login", func(c *gin.Context) {
		utils.RenderHTMLWithPartials(c, "./frontend/login.html")
	})
	r.GET("/register", func(c *gin.Context) {
		utils.RenderHTMLWithPartials(c, "./frontend/register.html")
	})
	r.GET("/admin", func(c *gin.Context) {
		utils.RenderHTMLWithPartials(c, "./frontend/admin.html")
	})

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

	admin := models.User{
		Email:    "admin@graduation.com",
		Password: string(hashedPassword),
		FullName: "Admin",
		Role:     "admin",
	}
	config.DB.FirstOrCreate(&admin, models.User{Email: admin.Email})

	println("✅ Setup complete!")
	println("Admin email: admin@graduation.com")
	println("Admin password: admin123")

	// API routes
	routes.SetupRoutes(r)

	r.Run(":8080")
}
