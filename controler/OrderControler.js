const { Order, Cart, Item, User } = require('../models');
const SuccessResponse = require('../helpers/Success.helper');

class OrderController {
  async getOrder(req, res, next) {
    try {
      const result = await Order.findAll({
        include: [
          {
            model: User,
          },
          {
            model: Cart,
            include: {
              model: Item,
            },
          },
        ],
      });
      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  async getOrderbyId(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Order.findOne({
        where: { id },
        include: [
          {
            model: User,
          },
          {
            model: Cart,
            include: {
              model: Item,
            },
          },
        ],
      });
      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  async addOrder(req, res, next) {
    try {
      const { userId, cartId } = req.params;
      const result2 = await Cart.update({ statusCart: true }, { where: { id: cartId } });
      const result = await Order.create({
        userId,
        cartId,
        statusOrder: 'pending',
      });
      return new SuccessResponse(res, 201, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  //update property statusOrder
  async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { statusOrder } = req.body;
      const result = await Order.update(
        { statusOrder },
        {
          where: {
            id,
          },
        }
      );
      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Order.destroy({ where: { id } });
      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  OrderController,
};
