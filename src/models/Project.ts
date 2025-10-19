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

    clientConversation: { type: String, required: true },
    projectReference: { type: String },
    projectFigma: { type: String },

    ourDomainDetails: {
      url: { type: String },
      userId: { type: String },
      password: { type: String },
    },

    clientExistingSite: {
      url: { type: String },
      userId: { type: String },
      password: { type: String },
    },

    note: [
      {
        date: { type: Date, default: Date.now },
        userid: { type: String },
        what: { type: String },
      },
    ],

    deliveryDate: { type: Date },
    createdAt: { type: Date, default: Date.now },

    projectProgress: { type: Number, default: 0, min: 0, max: 100 },

    projectRating: {
      date: { type: Date },
      rate: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      tips: { type: Number },
    },
  },
  { timestamps: true }
);

const Project = models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
