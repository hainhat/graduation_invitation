package controllers

import (
	"graduation_invitation/backend/config"
	"graduation_invitation/backend/models"
	"graduation_invitation/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// LoginRequest là dữ liệu gửi từ frontend
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// POST /api/login
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid input"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "email = ?", req.Email).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not found"})
		return
	}

	// Kiểm tra mật khẩu
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Wrong password"})
		return
	}

	// Sinh token JWT
	token, err := utils.GenerateJWT(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   token,
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"full_name": user.FullName,
			"role":      user.Role,
		},
	})
}

// GET /api/me
func Me(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Not logged in"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user":    user,
	})
}

// RegisterRequest chứa dữ liệu khi đăng ký
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Phone    string `json:"phone"`
}

// POST /api/register
func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc",
		})
		return
	}

	// Kiểm tra email trùng
	var existing models.User
	if err := config.DB.First(&existing, "email = ?", req.Email).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Email đã được sử dụng",
		})
		return
	}

	// Hash mật khẩu
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Không thể tạo tài khoản"})
		return
	}

	// Tạo user mới
	user := models.User{
		Email:    req.Email,
		Password: string(hashedPassword),
		FullName: req.FullName,
		Phone:    req.Phone,
		Role:     "user", // mặc định là user thường
	}
	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Không thể lưu người dùng"})
		return
	}

	// Sinh JWT token sau khi đăng ký
	token, err := utils.GenerateJWT(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Không thể tạo token"})
		return
	}

	// Trả về user và token
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Đăng ký thành công",
		"token":   token,
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"full_name": user.FullName,
			"role":      user.Role,
		},
	})
}

// GET /api/check-email?email=...
func CheckEmail(c *gin.Context) {
	email := c.Query("email")
	if email == "" {
		c.JSON(400, gin.H{"exists": false})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "email = ?", email).Error; err == nil {
		c.JSON(200, gin.H{"exists": true})
	} else {
		c.JSON(200, gin.H{"exists": false})
	}
}
