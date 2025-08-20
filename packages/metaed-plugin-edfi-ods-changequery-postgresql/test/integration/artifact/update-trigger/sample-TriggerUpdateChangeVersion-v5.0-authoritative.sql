CREATE TRIGGER UpdateChangeVersion BEFORE UPDATE ON sample.PostSecondaryOrganization
    FOR EACH ROW EXECUTE PROCEDURE changes.UpdateChangeVersion();

