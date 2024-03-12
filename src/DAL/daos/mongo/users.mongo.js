import { usersModel } from "../../models/users.model.js";

class UsersManager {
    async findAll() {
        const response = await usersModel.find().populate('cart');
        return response;
    }

    async findById(id) {
        const response = await usersModel.findById(id).populate('cart');
        return response;
    }

    async findByEmail(email) {
        const response = await usersModel.findOne({email}).populate('cart');
        return response;
    }

    async createOne(obj) {
        const response = await usersModel.create(obj);
        return response;
    }

    async updateOne(id,obj) {
        const response = await usersModel.updateOne({_id: id}, obj);
        return response;
    }

    async deleteOne(id) {
        const response = await usersModel.deleteOne({_id: id});
        return response;
    }
    
    async deleteMany(users) {
        const response = await usersModel.deleteMany(users);
        return response;
    }

    async findByCart(cart) {
        const response = await usersModel.findOne({cart});
        return response;
    }
}

export const UserManager = new UsersManager();