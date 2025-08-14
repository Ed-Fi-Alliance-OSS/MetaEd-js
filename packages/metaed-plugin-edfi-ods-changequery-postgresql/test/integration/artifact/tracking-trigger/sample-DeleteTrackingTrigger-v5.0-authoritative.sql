CREATE FUNCTION tracked_deletes_sample.InstitutionControlDescriptor_TR_DelTrkg()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO tracked_deletes_sample.InstitutionControlDescriptor(InstitutionControlDescriptorId, Id, ChangeVersion)
    SELECT OLD.InstitutionControlDescriptorId, Id, nextval('changes.ChangeVersionSequence')
    FROM edfi.Descriptor WHERE DescriptorId = OLD.InstitutionControlDescriptorId;
    RETURN NULL;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER TrackDeletes AFTER DELETE ON sample.InstitutionControlDescriptor 
    FOR EACH ROW EXECUTE PROCEDURE tracked_deletes_sample.InstitutionControlDescriptor_TR_DelTrkg();

CREATE FUNCTION tracked_deletes_sample.InstitutionLevelDescriptor_TR_DelTrkg()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO tracked_deletes_sample.InstitutionLevelDescriptor(InstitutionLevelDescriptorId, Id, ChangeVersion)
    SELECT OLD.InstitutionLevelDescriptorId, Id, nextval('changes.ChangeVersionSequence')
    FROM edfi.Descriptor WHERE DescriptorId = OLD.InstitutionLevelDescriptorId;
    RETURN NULL;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER TrackDeletes AFTER DELETE ON sample.InstitutionLevelDescriptor 
    FOR EACH ROW EXECUTE PROCEDURE tracked_deletes_sample.InstitutionLevelDescriptor_TR_DelTrkg();

CREATE FUNCTION tracked_deletes_sample.PostSecondaryOrganization_TR_DelTrkg()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO tracked_deletes_sample.PostSecondaryOrganization(NameOfInstitution, Id, ChangeVersion)
    VALUES (OLD.NameOfInstitution, OLD.Id, nextval('changes.ChangeVersionSequence'));
    RETURN NULL;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER TrackDeletes AFTER DELETE ON sample.PostSecondaryOrganization 
    FOR EACH ROW EXECUTE PROCEDURE tracked_deletes_sample.PostSecondaryOrganization_TR_DelTrkg();

CREATE FUNCTION tracked_deletes_sample.SpecialEducationGraduationStatusDescriptor_TR_DelTrkg()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO tracked_deletes_sample.SpecialEducationGraduationStatusDescriptor(SpecialEducationGraduationStatusDescriptorId, Id, ChangeVersion)
    SELECT OLD.SpecialEducationGraduationStatusDescriptorId, Id, nextval('changes.ChangeVersionSequence')
    FROM edfi.Descriptor WHERE DescriptorId = OLD.SpecialEducationGraduationStatusDescriptorId;
    RETURN NULL;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER TrackDeletes AFTER DELETE ON sample.SpecialEducationGraduationStatusDescriptor 
    FOR EACH ROW EXECUTE PROCEDURE tracked_deletes_sample.SpecialEducationGraduationStatusDescriptor_TR_DelTrkg();

CREATE FUNCTION tracked_deletes_sample.SubmissionCertificationDescriptor_TR_DelTrkg()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO tracked_deletes_sample.SubmissionCertificationDescriptor(SubmissionCertificationDescriptorId, Id, ChangeVersion)
    SELECT OLD.SubmissionCertificationDescriptorId, Id, nextval('changes.ChangeVersionSequence')
    FROM edfi.Descriptor WHERE DescriptorId = OLD.SubmissionCertificationDescriptorId;
    RETURN NULL;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER TrackDeletes AFTER DELETE ON sample.SubmissionCertificationDescriptor 
    FOR EACH ROW EXECUTE PROCEDURE tracked_deletes_sample.SubmissionCertificationDescriptor_TR_DelTrkg();

