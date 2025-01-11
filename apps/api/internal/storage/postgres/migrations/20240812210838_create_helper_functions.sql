-- +goose Up
-- +goose StatementBegin
CREATE FUNCTION sync_updated_at_column () RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CLOCK_TIMESTAMP();
    RETURN NEW;
END;
$$;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP FUNCTION sync_updated_at_column;

-- +goose StatementEnd