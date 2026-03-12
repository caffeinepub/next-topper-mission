import Set "mo:core/Set";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Batch = {
    name : Text;
    streamId : Text;
    courseMaterialCollectionId : Text;
    appraisalCycleId : Text;
  };

  type StudentProfile = {
    id : Text;
    name : Text;
    fatherName : Text;
    dob : Text;
    contactNumber : Text;
    city : Text;
    state : Text;
    rollNumber : Text;
    address : Text;
    email : Text;
    currentBatch : Text;
    pastBatches : [Text];
  };

  type EducationalResource = {
    id : Text;
    title : Text;
    resourceType : Text;
    accessLevel : Text;
    content : Text;
    batch : Text;
    downloadUrl : Text;
    pdfId : Text;
    uploadDate : Int;
    uploadedBy : Text;
    fileSize : Nat;
    file : Storage.ExternalBlob;
  };

  type CourseMaterial = {
    id : Text;
    title : Text;
    batch : Text;
    fileUrl : Text;
    fileSize : Nat;
    uploadDate : Int;
    uploadedBy : Text;
    originalFileName : Text;
  };

  type AppraisalCycle = {
    id : Text;
    cycleType : Text;
    title : Text;
    batch : Text;
    startDate : Text;
    endDate : Text;
    evaluationCriteria : Text;
    resultsUrl : Text;
    answerSheetAnalysisId : Text;
    pdfUrl : Text;
  };

  type EvaluationResult = {
    studentId : Text;
    appraisalCycleId : Text;
    marks : Nat;
  };

  type GeneralDocument = {
    id : Text;
    title : Text;
    documentType : Text;
    fileUrl : Text;
    fileSize : Nat;
    uploadDate : Int;
    uploadedBy : Text;
    accessLevel : Text;
    originalFileName : Text;
  };

  var adminSession : ?Principal = null;

  // Batches
  let batches = Map.empty<Text, Batch>();

  // Students
  let students = Map.empty<Text, StudentProfile>();

  // Educational Resources
  let educationalResources = Map.empty<Text, EducationalResource>();

  // Course Materials
  let courseMaterials = Map.empty<Text, CourseMaterial>();

  // Appraisal Cycles
  let appraisalCycles = Map.empty<Text, AppraisalCycle>();

  // Evaluation Results
  let evaluationResults = Map.empty<Text, [EvaluationResult]>();

  // General Documents
  let generalDocuments = Map.empty<Text, GeneralDocument>();

  // Valid Batches
  var validBatches = [
    "9th",
    "10th",
    "11th JEE",
    "11th NEET",
    "11th School PCM",
    "11th School PCB",
  ];

  func assertAdmin(authenticated : Bool) {
    if (not authenticated) {
      Runtime.trap("Unauthorized: Admin session required");
    };
  };

  // Batch Management
  public shared ({ caller }) func addBatch(name : Text, streamId : Text, courseMaterialCollectionId : Text, appraisalCycleId : Text) : async Bool {
    batches.add(
      name,
      {
        name;
        streamId;
        courseMaterialCollectionId;
        appraisalCycleId;
      },
    );
    true;
  };

  public query ({ caller }) func getBatch(name : Text) : async Batch {
    switch (batches.get(name)) {
      case (null) { Runtime.trap("Batch not found") };
      case (?batch) { batch };
    };
  };

  public query ({ caller }) func listBatches() : async [Batch] {
    batches.values().toArray();
  };

  // Validate Batch
  public shared ({ caller }) func validateBatch(selectedBatch : Text) : async Bool {
    switch (validBatches.find(func(b) { b == selectedBatch })) {
      case (null) { false };
      case (?_) { true };
    };
  };

  // Add File to Educational Resources
  public shared ({ caller }) func uploadFileToEducationalResource(
    title : Text,
    resourceType : Text,
    accessLevel : Text,
    content : Text,
    batch : Text,
    downloadUrl : Text,
    pdfId : Text,
    uploadedBy : Text,
    fileSize : Nat,
    blob : Storage.ExternalBlob,
  ) : async Text {
    let id = title.concat(Time.now().toText());
    let resource = {
      id;
      title;
      resourceType;
      accessLevel;
      content;
      batch;
      downloadUrl;
      pdfId;
      uploadDate = Time.now();
      uploadedBy;
      fileSize;
      file = blob;
    };

    educationalResources.add(id, resource);
    id;
  };

  // Add File to Course Materials
  public shared ({ caller }) func uploadFileToCourseMaterial(
    title : Text,
    batch : Text,
    fileUrl : Text,
    fileSize : Nat,
    uploadedBy : Text,
    originalFileName : Text,
    blob : Storage.ExternalBlob,
  ) : async Text {
    let id = title.concat(Time.now().toText());
    let material = {
      id;
      title;
      batch;
      fileUrl;
      fileSize;
      uploadDate = Time.now();
      uploadedBy;
      originalFileName;
    };

    courseMaterials.add(id, material);
    id;
  };

  // Add File to General Documents
  public shared ({ caller }) func uploadFileToGeneralDocument(
    title : Text,
    documentType : Text,
    fileUrl : Text,
    fileSize : Nat,
    uploadedBy : Text,
    accessLevel : Text,
    originalFileName : Text,
    blob : Storage.ExternalBlob,
  ) : async Text {
    let id = title.concat(Time.now().toText());
    let document = {
      id;
      title;
      documentType;
      fileUrl;
      fileSize;
      uploadDate = Time.now();
      uploadedBy;
      accessLevel;
      originalFileName;
    };

    generalDocuments.add(id, document);
    id;
  };

  // Remove Course Material
  public shared ({ caller }) func deleteCourseMaterial(id : Text) : async Bool {
    if (not courseMaterials.containsKey(id)) {
      false;
    } else {
      courseMaterials.remove(id);
      true;
    };
  };

  // Remove Educational Resource
  public shared ({ caller }) func deleteEducationalResource(id : Text) : async Bool {
    if (not educationalResources.containsKey(id)) {
      false;
    } else {
      educationalResources.remove(id);
      true;
    };
  };

  // Remove General Document
  public shared ({ caller }) func deleteGeneralDocument(id : Text) : async Bool {
    if (not generalDocuments.containsKey(id)) {
      false;
    } else {
      generalDocuments.remove(id);
      true;
    };
  };

  // Remove Appraisal Cycle
  public shared ({ caller }) func deleteAppraisalCycle(id : Text) : async Bool {
    if (not appraisalCycles.containsKey(id)) {
      false;
    } else {
      appraisalCycles.remove(id);
      true;
    };
  };

  // Retrieve Educational Resources by Resource Type
  public query ({ caller }) func getEducationalResources(resourceType : Text) : async [EducationalResource] {
    educationalResources.values().toArray().filter(func(resource) { resource.resourceType == resourceType });
  };

  // Retrieve Course Materials by Batch
  public query ({ caller }) func getCourseMaterialsByBatch(batch : Text) : async [CourseMaterial] {
    courseMaterials.values().toArray().filter(func(material) { material.batch == batch });
  };

  // Retrieve General Documents by Type
  public query ({ caller }) func getGeneralDocumentsByType(documentType : Text) : async [GeneralDocument] {
    generalDocuments.values().toArray().filter(func(doc) { doc.documentType == documentType });
  };

  // Retrieve Appraisal Cycles by Batch
  public query ({ caller }) func getAppraisalCyclesByBatch(batch : Text) : async [AppraisalCycle] {
    appraisalCycles.values().toArray().filter(func(cycle) { cycle.batch == batch });
  };
};
