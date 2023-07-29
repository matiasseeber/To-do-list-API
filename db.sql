CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE UNIQUE NOT NULL,
    password VARCHAR(100),
	verification_code int,
	last_verification_code_sent_at timestamp without time zone,
	last_verification_at timestamp without time zone
);

CREATE TABLE IF NOT EXISTS public.refresh_tokens
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    token character varying(256) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone default current_timestamp,
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT fk_users FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION public.update_updated_at_col()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END
$BODY$;

CREATE TRIGGER update_updated_at_col_trigger
AFTER INSERT
ON refresh_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_col();