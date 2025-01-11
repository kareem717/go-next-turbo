package project

type NameField struct {
	Name string `json:"name" minLength:"1" maxLength:"60"`
}
