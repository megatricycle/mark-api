import UserModel from './user';
import ProductModel from './product';

ProductModel.belongsTo(UserModel);
UserModel.hasMany(ProductModel);

export const User = UserModel;
export const Product = ProductModel;
