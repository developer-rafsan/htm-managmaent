import mongoose, { Schema, models } from "mongoose";

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
    withoutFiverrBudget: { type: Number },

    // Updated: files array instead of single string
    files: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],

    // Updated: projectResourceFiles array
    projectResourceFiles: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],

    // Multiple References
    projectReferences: [{ type: String }],

    // Multiple Figma Links
    projectFigmas: [{ type: String }],

    // Our Domain Details
    ourDomainDetails: {
      url: { type: String },
      userId: { type: String },
      password: { type: String },
    },

    // Client Existing Site
    clientExistingSite: {
      url: { type: String },
      userId: { type: String },
      password: { type: String },
    },

    // project description
    projectDescription: {
      type: String,
    },

    //  Notes
    note: [
      {
        date: { type: Date, default: Date.now },
        userid: { type: String },
        what: { type: String },
      },
    ],

    // Delivery date
    deliveryDate: { type: Date },

    // Project Rating
    projectRating: [
      {
        userid: { type: String },
        date: { type: Date },
        rate: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        tips: { type: Number },
      },
    ],

    // Project Progress optional, default 0
    projectProgress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

const Project = models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
