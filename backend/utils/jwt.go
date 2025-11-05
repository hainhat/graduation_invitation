package utils

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var jwtSecret = []byte("supersecretkey123") // thay bằng key riêng của bạn

// GenerateJWT tạo token chứa ID và Role của user
func GenerateJWT(userID uint, role string) (string, error) {
	claims := jwt.MapClaims{
		"id":   userID,
		"role": role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(), // Hết hạn sau 1 ngày
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ParseJWT xác minh token và trả về claims
func ParseJWT(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, err
	}
	return claims, nil
}
