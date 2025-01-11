package shared

import "time"

// CursorPagination is a pagination strategy that uses a cursor and limit to paginate results
// which does not allow for skipping results but is more efficient
type CursorPagination struct {
	Cursor int `json:"cursor" default:"1" min:"1" required:"false"`
	Limit  int `json:"limit" default:"10" min:"1" max:"100" required:"false"`
}

type TimeCursorPagination struct {
	Cursor time.Time `json:"cursor" required:"false"`
	Limit  int       `json:"limit" default:"10" min:"1" max:"100" required:"false"`
}

// OffsetPagination is a pagination strategy that uses an offset and limit to paginate results
// which does allow for skipping results but is less efficient
type OffsetPagination struct {
	Page     int `json:"page" default:"1" min:"1" required:"false"`
	PageSize int `json:"pageSize" default:"10" min:"1" required:"false"`
}
