import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: true },
)

const invoiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
      uppercase: true,
      minlength: 6,
      maxlength: 6,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    createdAt: { type: String, required: true },
    paymentDue: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    paymentTerms: { type: Number, required: true, min: 1 },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'pending', 'paid'],
      default: 'pending',
      index: true,
    },
    senderAddress: { type: addressSchema, required: true },
    clientAddress: { type: addressSchema, required: true },
    items: { type: [itemSchema], required: true, default: [] },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

invoiceSchema.index({ owner: 1, id: 1 }, { unique: true })

export const Invoice = mongoose.model('Invoice', invoiceSchema)
