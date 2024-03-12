import { ProductManager } from "../DAL/daos/mongo/products.mongo.js";
import { UserManager } from '../DAL/daos/mongo/users.mongo.js'
import CustomError from '../errors/error.generator.js'
import { ErrorsMessages, ErrorsNames } from '../errors/errors.enum.js';
import { transporter } from "../utils/nodemailer.js";

class ProductsService {
    async findAll(obj) {
        const products = await ProductManager.findAll(obj);
        return products;
    } 

    async findById(id) {
        const product = await ProductManager.findById(id);
        return product;
    }
    
    async createOne(obj) {
        const product = await ProductManager.createOne(obj);
        return product;
    }

    async deleteOne(id,user) {
        const prod = await ProductManager.findById(id)
        if (!prod.owner == user.email || !user.role == 'admin'){
            return CustomError.generateError(ErrorsMessages.INVALID_CREDENTIALS,403,ErrorsNames.INVALID_CREDENTIALS);
        }
        const product = await ProductManager.deleteOne(id);
        const productOwner = await UserManager.findByEmail(prod.owner)
        const mailOptions = {
            from: 'Doymar eCommers',
            to: productOwner.email,
            subject: 'Your product was deleted',
            html: `<b>Hello ${productOwner.first_name}!</b>
            <p>The product ${prod.title} was deleted from the eCommers</p>`,
          }
          await transporter.sendMail(mailOptions);
        return product;
    }

    async updateOne(id, obj) {
        const product = await ProductManager.updateOne(id, obj);
        return product;
    }
}

export const productsService = new ProductsService();