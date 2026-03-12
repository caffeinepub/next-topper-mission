import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GeneralDocument {
    id: string;
    accessLevel: string;
    originalFileName: string;
    title: string;
    documentType: string;
    fileSize: bigint;
    uploadDate: bigint;
    uploadedBy: string;
    fileUrl: string;
}
export interface CourseMaterial {
    id: string;
    originalFileName: string;
    title: string;
    fileSize: bigint;
    batch: string;
    uploadDate: bigint;
    uploadedBy: string;
    fileUrl: string;
}
export interface AppraisalCycle {
    id: string;
    title: string;
    endDate: string;
    cycleType: string;
    evaluationCriteria: string;
    pdfUrl: string;
    batch: string;
    answerSheetAnalysisId: string;
    resultsUrl: string;
    startDate: string;
}
export interface EducationalResource {
    id: string;
    accessLevel: string;
    title: string;
    content: string;
    file: ExternalBlob;
    downloadUrl: string;
    fileSize: bigint;
    resourceType: string;
    batch: string;
    pdfId: string;
    uploadDate: bigint;
    uploadedBy: string;
}
export interface Batch {
    courseMaterialCollectionId: string;
    name: string;
    streamId: string;
    appraisalCycleId: string;
}
export interface backendInterface {
    addBatch(name: string, streamId: string, courseMaterialCollectionId: string, appraisalCycleId: string): Promise<boolean>;
    deleteAppraisalCycle(id: string): Promise<boolean>;
    deleteCourseMaterial(id: string): Promise<boolean>;
    deleteEducationalResource(id: string): Promise<boolean>;
    deleteGeneralDocument(id: string): Promise<boolean>;
    getAppraisalCyclesByBatch(batch: string): Promise<Array<AppraisalCycle>>;
    getBatch(name: string): Promise<Batch>;
    getCourseMaterialsByBatch(batch: string): Promise<Array<CourseMaterial>>;
    getEducationalResources(resourceType: string): Promise<Array<EducationalResource>>;
    getGeneralDocumentsByType(documentType: string): Promise<Array<GeneralDocument>>;
    listBatches(): Promise<Array<Batch>>;
    uploadFileToCourseMaterial(title: string, batch: string, fileUrl: string, fileSize: bigint, uploadedBy: string, originalFileName: string, blob: ExternalBlob): Promise<string>;
    uploadFileToEducationalResource(title: string, resourceType: string, accessLevel: string, content: string, batch: string, downloadUrl: string, pdfId: string, uploadedBy: string, fileSize: bigint, blob: ExternalBlob): Promise<string>;
    uploadFileToGeneralDocument(title: string, documentType: string, fileUrl: string, fileSize: bigint, uploadedBy: string, accessLevel: string, originalFileName: string, blob: ExternalBlob): Promise<string>;
    validateBatch(selectedBatch: string): Promise<boolean>;
}
