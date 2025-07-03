const { User, Order, Cart, Item, sequelize, Role, ImageUser, ResetLink } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const JWT_SECRET = process.env.JWT_SECRET;
const SuccessResponse = require('../helpers/Success.helper');
const ErrorResponse = require('../helpers/error.helper');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const sendResetPasswordEmail = require('../services/emailService');
const { where } = require('sequelize');

class UserController {
  async getUser(req, res, next) {
    try {
      const result = await User.findAll(
        {
          include: [
            {
              model: ImageUser,
            },
            {
              model: Role,
            },
            {
              model: Order,
            },
            {
              model: Cart,
              include: {
                model: Item,
              },
            },
          ],
        },
        { where: { isDeleted: false } }
      );
      if (!result) {
        throw new ErrorResponse(401, result, 'User is not found');
      }
      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  async getUserbyId(req, res, next) {
    try {
      const { id } = req.params;
      const result = await User.findOne(
        {
          where: { id },
          include: [
            {
              model: ImageUser,
            },
            {
              model: Role,
            },
            {
              model: Order,
            },
            {
              model: Cart,
              include: {
                model: Item,
              },
            },
          ],
        },
        { where: { isDeleted: false } }
      );

      if (!result) {
        throw new ErrorResponse(401, result, 'User is not found');
      }

      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  async addUser(req, res, next) {
    try {
      const { fullName, email, password, address, phone, roleName } = req.body;
      const checkUser = await User.findOne({ where: { email: email.toLowerCase() } });
      const schema = {
        email: { type: 'email', optional: false },
        password: { type: 'string', min: 5, max: 255, optional: false },
      };
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      if (checkUser) {
        // validate Email
        if (checkUser.dataValues.email == email.toLowerCase()) {
          if (req.file) {
            const deletedImageUpload = cloudinary.uploader.destroy(req.file.filename);
          }
          throw new ErrorResponse(401, {}, 'Email Already Exist');
        } else {
          // Validate Data
          const validationResult = v.validate({ email, password }, schema);

          if (validationResult !== true) {
            throw new ErrorResponse(401, validationResult, 'Validation Failed');
          } else {
            const checkRole = await Role.findOne({ where: { roleName: roleName.toLowerCase() } });
            if (checkRole) {
              const result = await User.create({
                fullName,
                email: email.toLowerCase(),
                password: hash,
                address,
                phone,
                roleId: checkRole.id,
              });
              if (req.file) {
                const imageProfile = await ImageUser.create({
                  cloudinaryId: req.file.filename,
                  url: req.file.path,
                  userId: result.id,
                });
              }
              return new SuccessResponse(res, 200, result, 'Success');
            }

            const role = await Role.create({ roleName: roleName.toLowerCase() });
            const result = await User.create({
              fullName,
              email: email.toLowerCase(),
              password: hash,
              address,
              phone,
              roleId: role.id,
            });
            if (req.file) {
              const imageProfile = await ImageUser.create({
                cloudinaryId: req.file.filename,
                url: req.file.path,
                userId: result.id,
              });
            }
            return new SuccessResponse(res, 200, result, 'Success');
          }
        }
      } else {
        // Validate Data
        const validationResult = v.validate({ email, password }, schema);

        if (validationResult !== true) {
          throw new ErrorResponse(401, validationResult, 'Validation Failed');
        } else {
          const checkRole = await Role.findOne({ where: { roleName: roleName.toLowerCase() } });
          if (checkRole) {
            const result = await User.create({
              fullName,
              email: email.toLowerCase(),
              password: hash,
              address,
              phone,
              roleId: checkRole.id,
            });
            if (req.file) {
              const imageProfile = await ImageUser.create({
                cloudinaryId: req.file.filename,
                url: req.file.path,
                userId: result.id,
              });
            }
            return new SuccessResponse(res, 201, result, 'Success');
          }
          const role = await Role.create({ roleName: roleName.toLowerCase() });
          const result = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hash,
            address,
            phone,
            roleId: role.id,
          });
          if (req.file) {
            const imageProfile = await ImageUser.create({
              cloudinaryId: req.file.filename,
              url: req.file.path,
              userId: result.id,
            });
          }
          return new SuccessResponse(res, 201, result, 'Success');
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const checkUser = await User.findOne({
        where: { email: email.toLowerCase() },
        include: [{ model: ImageUser }, { model: Role }],
      });

      if (!checkUser) {
        throw new ErrorResponse(401, {}, 'Email not Found');
      }

      const checkPassword = bcrypt.compareSync(password, checkUser.dataValues.password);

      if (!checkPassword) {
        throw new ErrorResponse(401, {}, 'Wrong Password');
      }

      const _token = jwt.sign(
        {
          email: email.toLowerCase(),
          id: checkUser.dataValues.id,
          role: checkUser.Role.roleName,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        status: true,
        message: 'Login success',
        token: _token,
        data: checkUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { fullName, email, password, address, phone } = req.body;
      const checkUser = await User.findOne({ where: { id } });
      const schema = {
        email: { type: 'email', optional: true },
        password: { type: 'string', min: 5, max: 255, optional: true },
      };
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      if (!checkUser) {
        throw new ErrorResponse(401, {}, 'User Not Found');
      }

      if (checkUser) {
        // Validate Email
        if (checkUser.dataValues.email == email.toLowerCase()) {
          if (req.file) {
            const deletedImageUpload = cloudinary.uploader.destroy(req.file.filename);
          }
          throw new ErrorResponse(401, {}, 'Email Already Exist');
        } else {
          // Validate Data
          const validationResult = v.validate({ email, password }, schema);

          if (validationResult !== true) {
            throw new ErrorResponse(401, validationResult, 'Validation Failed');
          } else {
            const result = await User.update(
              {
                fullName,
                email: email.toLowerCase(),
                password: hash,
                address,
                phone,
                updatedAt: new Date(),
              },
              {
                where: {
                  id,
                },
              }
            );
            if (req.file) {
              const checkImageUser = await ImageUser.findOne({
                where: { userId: id },
              });
              if (checkImageUser) {
                const deleteImageCloudinary = await cloudinary.uploader.destroy(
                  checkImageUser.cloudinaryId
                );
                const updateImageProfile = await ImageUser.update(
                  {
                    cloudinaryId: req.file.filename,
                    url: req.file.path,
                    updatedAt: new Date(),
                  },
                  { where: { userId: id } }
                );
              } else {
                const imageProfile = await ImageUser.create({
                  cloudinaryId: req.file.filename,
                  url: req.file.path,
                  userId: id,
                });
              }
            }
            return new SuccessResponse(res, 200, result, 'Success');
          }
        }
      } else {
        // Validate Data
        const validationResult = v.validate({ email, password }, schema);

        if (validationResult !== true) {
          throw new ErrorResponse(401, validationResult, 'Validation Failed');
        } else {
          const result2 = await User.update(
            {
              fullName,
              email: email.toLowerCase(),
              password: hash,
              address,
              phone,
              updatedAt: new Date(),
            },
            {
              where: {
                id,
              },
            }
          );
          if (req.file) {
            const checkImageUser = await ImageUser.findOne({
              where: { userId: id },
            });
            if (checkImageUser) {
              const deleteImageCloudinary = await cloudinary.uploader.destroy(
                checkImageUser.cloudinaryId
              );
              const updateImageProfile = await ImageUser.update(
                {
                  cloudinaryId: req.file.filename,
                  url: req.file.path,
                  updatedAt: new Date(),
                },
                { where: { userId: id } }
              );
            } else {
              const imageProfile = await ImageUser.create({
                cloudinaryId: req.file.filename,
                url: req.file.path,
                userId: id,
              });
            }
          }

          return new SuccessResponse(res, 200, result2, 'Success');
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const checkUser = await User.findOne({ where: { id } });

      if (!checkUser) {
        throw new ErrorResponse(401, {}, 'User Not Found');
      }
      const checkImageUser = await ImageUser.findOne({ where: { userId: id } });
      const deletedImageCloudinary = await cloudinary.uploader.destroy(checkImageUser.cloudinaryId);
      const deletedImageUser = await ImageUser.destroy({
        where: { userId: id },
      });
      const result = await User.update(
        { isDeleted: true, updatedAt: new Date() },
        { where: { id } }
      );
      return new SuccessResponse(res, 200, result, 'Success');
    } catch (error) {
      next(error);
    }
  }

  async getUserEmail(req, res, next) {
    const { email } = req.query;
    try {
      const result = await User.findOne({
        where: { email: email.toLowerCase() },
        attributes: ['email'],
      });
      if (!result) {
        return new SuccessResponse(res, 200, result, 'Email is not available');
      }
      throw new ErrorResponse(401, result, 'Email is Available');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) {
        throw new ErrorResponse(404, {}, 'Email Not Found');
      }
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      const resetResult = await ResetLink.findOne({
        where: { userId: user.id },
      });

      if (resetResult) {
        await ResetLink.update(
          { token, expiresAt, used: false, updatedAt: new Date() },
          { where: { userId: user.id } }
        );
      } else {
        await ResetLink.create({
          userId: user.id,
          email: email.toLowerCase(),
          token,
          expiresAt,
          used: false,
        });
      }
      const _resetLink = `${process.env.BASE_URL_FRONTEND}/auth/resetPassword?token=${token}&email=${email.toLowerCase()}`;
      const result = await sendResetPasswordEmail(email.toLowerCase(), _resetLink);
      if (!result) {
        throw new ErrorResponse(401, result, 'Failed to send reset password email');
      }
      return new SuccessResponse(res, 200, result, 'Reset password link sent to email.');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    const { token } = req.query;
    const { email, newPassword } = req.body;
    try {
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) {
        throw new ErrorResponse(404, {}, 'Email not found');
      }
      const resetToken = await ResetLink.findOne({
        where: { userId: user.id },
      });
      if (!resetToken) {
        throw new ErrorResponse(404, {}, 'Invalid or expired token');
      }
      if (new Date() > resetToken.expiresAt) {
        throw new ErrorResponse(400, {}, 'Token has expired');
      }
      if (resetToken.used) {
        throw new ErrorResponse(400, {}, 'Token has already been used');
      }
      const isValid = await ResetLink.findOne({ where: { token } });
      if (!isValid) {
        throw new ErrorResponse(400, {}, 'Invalid token');
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      await User.update({ password: hash, updatedAt: new Date() }, { where: { email: email.toLowerCase() } });

      await ResetLink.update({ used: true, updatedAt: new Date() }, { where: { userId: user.id } });

      return new SuccessResponse(res, 200, {}, 'Password has been reset successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  UserController,
};
