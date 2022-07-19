DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sample' AND table_name='PostSecondaryOrganization' AND column_name='changeversion') THEN
ALTER TABLE sample.PostSecondaryOrganization ADD ChangeVersion BIGINT DEFAULT nextval('changes.ChangeVersionSequence') NOT NULL;
END IF;

END
$$;
