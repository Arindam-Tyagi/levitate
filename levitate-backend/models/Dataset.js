import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sourceType: { type: String, enum: ['upload', 'database'], required: true },
  fileName: { type: String },
  size: { type: Number },
  rowCount: { type: Number, required: true },
  columns: { type: [String], required: true },
  dataPreview: { type: [mongoose.Schema.Types.Mixed] },
}, { timestamps: true });

const Dataset = mongoose.model('Dataset', datasetSchema);
export default Dataset;