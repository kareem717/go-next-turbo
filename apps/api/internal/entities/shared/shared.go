package shared

import (
	"time"
)

// Timestamps represents the standard timestamps used for an entity.
type Timestamps struct {
	CreatedAt time.Time `json:"created_at" format:"date-time"`
	// UpdatedAt is the timestamp of the most recent update. Null until the first update.
	UpdatedAt *time.Time `json:"updated_at" format:"date-time"`
}

// IntegerID represents a 32 bit integer ID, often used as a primary key.
type IntegerID struct {
	ID int32 `json:"id" minimum:"1" bun:",pk"`
}
