import mongoose from 'mongoose';

interface IUrlDoc {
  code: string;
  target: string;
}

const UrlSchema = new mongoose.Schema<IUrlDoc>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  target: {
    type: String,
    required: true,
    unique: true,
  },
});

const UrlModel = mongoose.models.Url || mongoose.model<IUrlDoc>('Url', UrlSchema);

export default UrlModel;
export type { IUrlDoc };
