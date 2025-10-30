package models

import (
	"time"

	"gorm.io/gorm"
)

type RSVP struct {
	ID     uint  `json:"id" gorm:"primaryKey"`
	UserID *uint `json:"user_id" gorm:"index"` // Nullable FK
	User   *User `json:"user,omitempty" gorm:"foreignKey:UserID;constraint:OnDelete:SET NULL"`

	// Guest info (for non-registered users)
	GuestName  string `json:"guest_name"`
	GuestEmail string `json:"guest_email"`
	GuestPhone string `json:"guest_phone"`

	// RSVP details
	Status     string `json:"status" gorm:"not null;check:status IN ('yes', 'no', 'maybe')"`
	GuestCount int    `json:"guest_count" gorm:"default:1"`
	Message    string `json:"message" gorm:"type:text"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// Get display name
func (r *RSVP) GetDisplayName() string {
	if r.User != nil {
		return r.User.FullName
	}
	return r.GuestName
}

// Get display email
func (r *RSVP) GetDisplayEmail() string {
	if r.User != nil {
		return r.User.Email
	}
	return r.GuestEmail
}

// Get display phone
func (r *RSVP) GetDisplayPhone() string {
	if r.User != nil {
		return r.User.Phone
	}
	return r.GuestPhone
}
