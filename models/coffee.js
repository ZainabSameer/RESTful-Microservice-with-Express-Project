import joi from 'joi'

const coffeeSchema = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  origin: joi.string().allow(null, '').optional(),
  roast: joi.string().allow(null, '').optional(),
  createdAt: joi.string().isoDate().optional()
})

export default coffeeSchema
