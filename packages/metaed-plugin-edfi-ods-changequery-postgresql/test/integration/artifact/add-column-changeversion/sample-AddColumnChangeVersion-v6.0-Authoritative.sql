DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sample' AND table_name='PostSecondaryOrganization' AND column_name='changeversion') THEN
ALTER TABLE sample.PostSecondaryOrganization ADD ChangeVersion BIGINT DEFAULT (0) NOT NULL; 
ALTER TABLE sample.PostSecondaryOrganization ALTER ChangeVersion SET DEFAULT nextval('changes.ChangeVersionSequence');
END IF;

END
$$;
