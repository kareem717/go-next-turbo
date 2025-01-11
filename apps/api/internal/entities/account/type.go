package account

type UsernameField struct {
	Username string `json:"username" minLength:"3" maxLength:"50"`
}
