import { CartManager } from "../DAL/daos/mongo/carts.mongo.js";
import { ProductManager } from "../DAL/daos/mongo/products.mongo.js";
import { TicketManager } from '../DAL/daos/mongo/tickets.mongo.js'
import { UserManager } from "../DAL/daos/mongo/users.mongo.js";
import { v4 as uuidv4 } from 'uuid'
import { logger } from "../utils/logger.js";

class CarsService {
    async findById(id) {
    const cart = await CartManager.findCartById(id);
    return cart;
    }

    async createOne() {
    const cart = await CartManager.createCart();
    return cart;
    }

    async addProduct(cid,pid,owner) {
      const product = await ProductManager.findById(pid);
      if (product.owner == owner){
        return {message: 'You cannot add products you own'}
      }
      const cart = await CartManager.addProductToCart(cid,pid);
    return cart;
    }

    async deleteProduct(cid,pid) {
    const cart = await CartManager.deleteProductToCart(cid,pid);
    return cart;
    }

    async updateArray(cid,prod) {
    const cart = await CartManager.updateProductsArray(cid,prod);
    return cart;
    }

    async updateQuantity(cid,pid,quant) {
    const cart = await CartManager.updateProductQuantity(cid,pid,quant);
    return cart;
    }

    async deleteAll(cid) {
    const cart = await CartManager.deleteAllProducts(cid);
    return cart;
    }

    async purchase(idCart) {
      const cart = await CartManager.findCartById(idCart);
      const user = await UserManager.findByCart(idCart);
      const products = cart.products;
      let availableProducts = [];
      let unavailableProducts = [];
      let totalAmount = 0;
      for (let item of products) {
        if (item.product.stock >= item.quantity) {
          availableProducts.push(item);
          item.product.stock -= item.quantity;
          await item.product.save();
          totalAmount += item.quantity * item.product.price;
        } else {
          unavailableProducts.push(item);
        }
      }
  
      cart.products = unavailableProducts;
      await cart.save();
      if (availableProducts.length) {
        const ticket = {
          code: uuidv4(),
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: user.email,
        };
        logger.info(ticket);
        const purchaseTicket = await TicketManager.createTicket(ticket);
        return { availableProducts, totalAmount, purchaseTicket };
      }
      return { unavailableProducts };
    };
}

export const cartsService = new CarsService();