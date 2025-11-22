import express from 'express'
import {
  createCoffee,
  getCoffees,
  getCoffeeById,
  updateCoffee,
  deleteCoffee
} from '../controllers/coffeeController.js'

const Router = express.Router()

Router.route('/coffees').get(getCoffees).post(createCoffee)

Router.route('/coffees/:id')
  .get(getCoffeeById)
  .put(updateCoffee)
  .delete(deleteCoffee)

export default Router
