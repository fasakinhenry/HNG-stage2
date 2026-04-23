import { Router } from 'express'
import { body } from 'express-validator'
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  listInvoices,
  markInvoicePaid,
  updateInvoice,
} from '../controllers/invoiceController.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validationMiddleware.js'

const router = Router()

const invoiceValidators = [
  body('createdAt').isString().notEmpty().withMessage('createdAt is required'),
  body('paymentTerms').isInt({ min: 1 }).withMessage('paymentTerms must be a positive integer'),
  body('description').isString().trim().notEmpty().withMessage('description is required'),
  body('clientName').isString().trim().notEmpty().withMessage('clientName is required'),
  body('clientEmail').isEmail().withMessage('clientEmail must be valid'),
  body('senderAddress.street').isString().trim().notEmpty().withMessage('senderAddress.street is required'),
  body('senderAddress.city').isString().trim().notEmpty().withMessage('senderAddress.city is required'),
  body('senderAddress.postCode').isString().trim().notEmpty().withMessage('senderAddress.postCode is required'),
  body('senderAddress.country').isString().trim().notEmpty().withMessage('senderAddress.country is required'),
  body('clientAddress.street').isString().trim().notEmpty().withMessage('clientAddress.street is required'),
  body('clientAddress.city').isString().trim().notEmpty().withMessage('clientAddress.city is required'),
  body('clientAddress.postCode').isString().trim().notEmpty().withMessage('clientAddress.postCode is required'),
  body('clientAddress.country').isString().trim().notEmpty().withMessage('clientAddress.country is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').isString().trim().notEmpty().withMessage('item name is required'),
  body('items.*.quantity').isFloat({ gt: 0 }).withMessage('quantity must be above 0'),
  body('items.*.price').isFloat({ gt: 0 }).withMessage('price must be above 0'),
]

router.use(requireAuth)

router.get('/', listInvoices)
router.get('/:id', getInvoice)
router.post('/', invoiceValidators, validateRequest, createInvoice)
router.put('/:id', invoiceValidators, validateRequest, updateInvoice)
router.patch('/:id/pay', markInvoicePaid)
router.delete('/:id', deleteInvoice)

export default router
