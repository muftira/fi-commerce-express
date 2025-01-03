const { Item, User, Category, ImageItem } = require("../models");
const SuccessResponse = require("../helpers/Success.helper");
const ErrorResponse = require("../helpers/error.helper");
const cloudinary = require("cloudinary").v2;

class ItemController {
  async getItem(req, res, next) {
    try {
      const result = await Item.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "fullName", "email", "phone"],
          },
          {
            model: Category,
          },
          {
            model: ImageItem,
          },
        ],
      });
      return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async getItembyId(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Item.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ["id", "fullName", "email", "phone"],
          },
          {
            model: Category,
          },
          {
            model: ImageItem,
          },
        ],
      });
      return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const { userId } = req.query;
      const { productName, price, categoryName, size, color } = req.body;
      const findCategory = await Category.findOne({ where: { categoryName: categoryName.toLowerCase() } });
      let category;

      if (!findCategory) {
        category = await Category.create({ categoryName: categoryName.toLowerCase() });
      }
      
      const result = await Item.create({
        userId,
        productName,
        price,
        categoryId: findCategory ? findCategory.id : category.id,
        size,
        color,
      });

      if(req.files) {
        await Promise.all(
          req.files.map((file) =>
            ImageItem.create({
              cloudinaryId: file.filename,
              url: file.path,
              itemId: result.id,
            })
          )
        );
      }
      
      return new SuccessResponse(res, 201, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const { categoryId } = req.query;
      const { productName, price, categoryName, size, color, deletedImage } = req.body;
      const findProduct = await Item.findOne({ where: { id: itemId } });
      const findCategory = await Category.findOne({ where: { id: categoryId } });
     
     if(!findProduct || !findCategory) {
      if(req.files) {
        const cloudinaryDeleted = await Promise.all(
          req.files.map((data) =>
            cloudinary.uploader.destroy(data.filename)
          )
        );
      }
      throw new ErrorResponse(401, {}, !findCategory ? 'Category is not found' : 'Product is not Found')
     }

     const category = await Category.update(
      { categoryName },
      {
        where: {
          id: categoryId,
        },
      }
    );
    const result = await Item.update(
      { productName, price, categoryId: category.id, size, color },
      {
        where: {
          id: itemId,
        },
      }
    );

    if (deletedImage) {
      if (typeof deletedImage == "string") {
        const validData = deletedImage.replace(
          /([{,]\s*)(\w+):/g,
          '$1"$2":'
        );
        const parseDeletedImage = JSON.parse(validData);
        const imageStatus = await Promise.all(
          parseDeletedImage?.map((data, index) =>
            ImageItem.update(
              { statusDeleted: data.status },
              { where: { id: data.id } }
            )
          )
        );
      } else {
        const imageStatus = await Promise.all(
          deletedImage.map((data, index) =>
            ImageItem.update(
              { statusDeleted: data.status },
              { where: { id: data.id } }
            )
          )
        );
      }

      const findImage = await ImageItem.findAll({
        where: { statusDeleted: true },
      });

      if (findImage.length > 0) {
        const cloudinaryDeleted = await Promise.all(
          findImage.map((data) =>
            cloudinary.uploader.destroy(data.cloudinaryId)
          )
        );
      }

      const imageDeleted = await ImageItem.destroy({
        where: { statusDeleted: true },
      });
    }

    if (req.files) {
      const imageUpdate = await Promise.all(
        req.files.map((file) =>
          ImageItem.create({
            cloudinaryId: file.filename,
            url: file.path,
            itemId,
          })
        )
      );
    }

    return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      const findImage = await ImageItem.findAll({ where: { itemId: id } });

      const findProduct = await Item.findOne({ where: { id } });

      if (!findProduct) {
        throw new ErrorResponse(401, {}, "Product not found");
      }

      if (findImage.length > 0) {
        const deletedCloudinary = await Promise.all(
          findImage.map((image) =>
            cloudinary.uploader.destroy(image.cloudinaryId)
          )
        );
        const deletedDatabaseImageItem = await ImageItem.destroy({
          where: { itemId: id },
        });
      }
      const deletedDatabaseProduct = await Item.destroy({ where: { id } });
      return new SuccessResponse(res, 200, deletedDatabaseProduct, "Success");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ItemController,
};
