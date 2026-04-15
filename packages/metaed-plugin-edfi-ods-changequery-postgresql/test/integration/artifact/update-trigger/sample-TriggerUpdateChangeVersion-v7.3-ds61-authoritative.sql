DO $$
BEGIN
IF NOT EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'updatechangeversion' AND event_object_schema = 'sample' AND event_object_table = 'postsecondaryorganization') THEN
CREATE TRIGGER UpdateChangeVersion BEFORE UPDATE ON sample.postsecondaryorganization
    FOR EACH ROW EXECUTE PROCEDURE changes.UpdateChangeVersion();
END IF;

END
$$;
