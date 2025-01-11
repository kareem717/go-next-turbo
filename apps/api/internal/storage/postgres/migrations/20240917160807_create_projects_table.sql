-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    projects (
        id serial PRIMARY KEY,
        owner_id INTEGER REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE,
        NAME VARCHAR(60) NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz
    );

CREATE INDEX projects_owner_id_idx ON projects (owner_id);

CREATE TRIGGER sync_projects_updated_at BEFORE
UPDATE ON projects FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE projects;

-- +goose StatementEnd