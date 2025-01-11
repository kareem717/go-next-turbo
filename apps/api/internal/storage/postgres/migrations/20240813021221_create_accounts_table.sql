-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    accounts (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES auth.users (id) NOT NULL,
        username VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE UNIQUE INDEX accounts_user_id_idx ON accounts (user_id);

CREATE TRIGGER sync_account_updated_at BEFORE
UPDATE ON accounts FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE accounts;

-- +goose StatementEnd