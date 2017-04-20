import UserModel from './user';
import ProductModel from './product';
import ManualModel from './manual';
import StepModel from './step';

ProductModel.belongsTo(UserModel);
UserModel.hasMany(ProductModel);

ProductModel.hasMany(ManualModel);

ManualModel.hasMany(StepModel);

export const User = UserModel;
export const Product = ProductModel;
export const Manual = ManualModel;
export const Step = StepModel;
