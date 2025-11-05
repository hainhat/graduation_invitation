package controllers

import (
	"net/http"
	"strings"

	"graduation_invitation/backend/config"
	"graduation_invitation/backend/models"
	"graduation_invitation/backend/utils"

	"github.com/gin-gonic/gin"
)

// POST /api/rsvp
func SubmitRSVP(c *gin.Context) {
	var req struct {
		GuestName  string `json:"guest_name"`
		GuestEmail string `json:"guest_email"`
		GuestPhone string `json:"guest_phone"`
		Status     string `json:"status"`
		GuestCount int    `json:"guest_count"`
		Message    string `json:"message"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Dữ liệu gửi lên không hợp lệ.",
		})
		return
	}

	if req.Status == "" {
		req.Status = "yes"
	}

	rsvp := models.RSVP{
		GuestName:  req.GuestName,
		GuestEmail: req.GuestEmail,
		GuestPhone: req.GuestPhone,
		Status:     req.Status,
		GuestCount: req.GuestCount,
		Message:    req.Message,
	}

	// ✅ Giải mã token và gắn user_id nếu có
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ParseJWT(token)
		if err == nil && claims != nil {
			if id, ok := claims["id"].(float64); ok {
				userID := uint(id)
				rsvp.UserID = &userID
				rsvp.GuestName = ""
				rsvp.GuestEmail = ""
				rsvp.GuestPhone = ""
			}
		}
	}

	// ✅ Lưu vào DB
	if err := config.DB.Create(&rsvp).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Không thể lưu RSVP. Vui lòng thử lại sau.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Cảm ơn bạn đã phản hồi!",
	})
}

// GET /api/rsvp (dành cho admin – xem tất cả RSVP)
func GetAllRSVPs(c *gin.Context) {
	var rsvps []models.RSVP
	if err := config.DB.Preload("User").Order("created_at desc").Find(&rsvps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Không thể lấy danh sách RSVP.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rsvps,
	})
}
