import CustomError from '../errors/error.generator.js';
import { ErrorsMessages, ErrorsNames } from '../errors/errors.enum.js';
import { cartsService } from '../services/carts.service.js'
import mongoose from 'mongoose';

export const createCart = async (req, res) => {
    try {
        const cart = await cartsService.createOne();
        res.status(200).json({message: "Cart", cart });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const findCartById = async (req, res, next) => {
    try {
        const { idCart } = req.params;
        if (!mongoose.Types.ObjectId.isValid(idCart)) {
          return CustomError.generateError(ErrorsMessages.OID_INVALID,404,ErrorsNames.OID_INVALID);
        }
        const cart = await cartsService.findById(idCart);
        if (!cart) {
          return CustomError.generateError(ErrorsMessages.CART_NOT_FOUND,404,ErrorsNames.CART_NOT_FOUND);
        }
        res.status(200).json({message: "Cart", cart });
    } catch (error) {
        next(error);
    }
}

export const addProductToCart = async (req, res, next) => {
    try {
      const { idCart, idProduct } = req.params;
      if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct) ) {
        return CustomError.generateError(ErrorsMessages.OID_INVALID,404, ErrorsNames.OID_INVALID);
      }
      const owner = req.user.email
      const cart = await cartsService.addProduct(idCart, idProduct, owner);
      if (!cart) {
        return CustomError.generateError(ErrorsMessages.CART_OR_PRODUCT_NOT_FOUND,404,ErrorsNames.CART_OR_PRODUCT_NOT_FOUND);
      }
      res.status(200).json({message: "Product added to Cart!" })
    } catch (error) {
      next(error);
    }
}

export const deleteProductToCart = async (req,res, next) => {
    try {
      const { cid, pid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid) ) {
        return CustomError.generateError(ErrorsMessages.OID_INVALID,404, ErrorsNames.OID_INVALID);
      }
      cart = await cartsService.deleteProduct(cid, pid);
      if (!cart) {
        return CustomError.generateError(ErrorsMessages.CART_OR_PRODUCT_NOT_FOUND,404,ErrorsNames.CART_OR_PRODUCT_NOT_FOUND);
      }
      res.status(200).json({message:'Product deleted', cart});
    } catch (error) {
      next(error);
    }
}

export const updateProductsArray = async (req, res, next) => {
    try {
      const {cid} = req.params;
      const {products} = req.body;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return CustomError.generateError(ErrorsMessages.OID_INVALID,404,ErrorsNames.OID_INVALID);
      }
      const cart = await cartsService.updateArray(cid,products)
      if (!cart) {
        return CustomError.generateError(ErrorsMessages.CART_NOT_FOUND,404,ErrorsNames.CART_NOT_FOUND);
      }
      res.status(200).json({message:'Products updated', cart});
    } catch (error) {
      next(error);
    }
}

export const updateProductQuantity =  async (req, res, next) => {
    try {
      const {quantity} = req.body;
      const { cid, pid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid) ) {
        return CustomError.generateError(ErrorsMessages.OID_INVALID,404, ErrorsNames.OID_INVALID);
      }
      const cart = await cartsService.updateQuantity(cid,pid,+quantity);
      if (!cart) {
        return CustomError.generateError(ErrorsMessages.CART_OR_PRODUCT_NOT_FOUND,404,ErrorsNames.CART_OR_PRODUCT_NOT_FOUND);
      }
      res.status(200).json({message:'Product quantity updated', cart});
    } catch (error) {
      next(error)
    } 
}

export const deleteAllProducts = async (req, res, next) => {
    try {
      const {cid} = req.params;
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        return CustomError.generateError(ErrorsMessages.OID_INVALID,404,ErrorsNames.OID_INVALID);
      }
      const cart = await cartsService.deleteAll(cid)
      if (!cart) {
        return CustomError.generateError(ErrorsMessages.CART_NOT_FOUND,404,ErrorsNames.CART_NOT_FOUND);
      }
      res.status(200).json({message:'Products deleted'});
    } catch (error) {
      next(error);
      //res.status(500).json({message: error.message});
    }
}

export const ticketPurchase = async (req, res, next) => {
  
  try {
    const {cid} = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return CustomError.generateError(ErrorsMessages.OID_INVALID,404,ErrorsNames.OID_INVALID);
    }
    const response = await cartsService.purchase(cid);
    if (!response) {
      return CustomError.generateError(ErrorsMessages.CART_NOT_FOUND,404,ErrorsNames.CART_NOT_FOUND);
    }
    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
}