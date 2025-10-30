package main

import (
	"graduation_invitation/backend/config"
	"graduation_invitation/backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.ConnectDB()

	r := gin.Default()

	r.Static("/", "./frontend")
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
	//routes.SetupRoutes(r)

	r.Run(":8080")
}
