package middleware

import (
	"errors"
	"strings"
)

func parseBearerToken(token string) (string, error) {
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	if accessToken == "" {
		return "", errors.New("an invalid access token was provided")
	}

	return accessToken, nil
}
