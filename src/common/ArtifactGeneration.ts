export enum ArtifactGeneration {
    None = 1 << 1,
    XSD = 1 << 2,
    ODS_SQL = 1 << 3,
    REST = 1 << 4,
    XSD_DataDictionary = 1 << 5,
    ODS_DataDictionary = 1 << 6,
    XSD_Interchanges = 1 << 7,
    XSD_Schema_Annotation = 1 << 8,
    JSON = 1 << 9,
    ODS_Id_Indexes = 1 << 10,
    All_XSD = XSD | XSD_Interchanges | XSD_Schema_Annotation,
    All_ODS = ODS_SQL | ODS_DataDictionary | ODS_Id_Indexes,
    Code = All_XSD | ODS_SQL | ODS_Id_Indexes | REST,
    Documentation = XSD_DataDictionary | ODS_DataDictionary | JSON,
    All = All_XSD | All_ODS | REST | Code | Documentation
}
