package config

import (
	"fmt"
	"graduation_invitation/backend/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "psql 'postgresql://neondb_owner:npg_ydJkj6RzMFq2@ep-nameless-violet-adh3afp1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // Show SQL queries
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("✅ Connected to PostgreSQL")

	// Auto migrate tables
	err = DB.AutoMigrate(
		&models.User{},
		&models.RSVP{},
		&models.Setting{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	fmt.Println("✅ Database migrated successfully")
}
