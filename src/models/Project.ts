import mongoose, { Schema, models, model } from "mongoose";

/* --------------------------
   Subschemas
----------------------------*/
const FileSchema = new Schema(
  {
    asset_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const NoteSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    userid: { type: String, required: true },
    what: { type: String, required: true },
  },
  { _id: false }
);

const RatingSchema = new Schema(
  {
    userid: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rate: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    tips: { type: Number, default: 0 },
  },
  { _id: false }
);

const DomainSchema = new Schema(
  {
    url: { type: String },
    userId: { type: String },
    password: { type: String },
  },
  { _id: false }
);

/* --------------------------
   Main Project Schema
----------------------------*/
const ProjectSchema = new Schema(
  {
    clientName: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    projectType: {
      type: String,
      enum: ["web", "graphic", "figma"],
      required: true,
    },
    projectStatus: { type: String, default: "pending" },
    projectBudget: { type: Number, required: true },
    withoutFiverrBudget: { type: Number, default: 0 },
    projectConversationFiles: [FileSchema],
    projectResourceFiles: [FileSchema],
    projectReferences: [{ type: String }],
    projectFigmas: [{ type: String }],
    ourDomainDetails: DomainSchema,
    clientExistingSite: DomainSchema,
    projectDescription: { type: String, default: "" },
    note: [NoteSchema],
    deliveryDate: { type: Date, required: true },
    projectRating: [RatingSchema],
    projectProgress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
