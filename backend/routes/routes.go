package routes

import (
	"graduation_invitation/backend/controllers"
	"graduation_invitation/backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Public routes
		api.POST("/login", controllers.Login)
		api.POST("/register", controllers.Register)
		api.GET("/check-email", controllers.CheckEmail)
		api.POST("/rsvp", controllers.SubmitRSVP)
		api.GET("/rsvp", controllers.GetAllRSVPs)
		api.POST("/refresh", controllers.RefreshToken) // ← THÊM MỚI
		// Protected routes (yêu cầu JWT)
		auth := api.Group("/")
		auth.Use(middleware.AuthJWT())
		{
			auth.GET("/me", controllers.Me) // Bước 3: tạo ở dưới
			// auth.POST("/rsvp", controllers.CreateRSVP)
			// auth.GET("/rsvp/stats", controllers.GetStats)
		}
	}
}
