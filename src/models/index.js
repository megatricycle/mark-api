import UserModel from './user';
import ProductModel from './product';
import ManualModel from './manual';
import StepModel from './step';

ProductModel.belongsTo(UserModel);
UserModel.hasMany(ProductModel);

UserModel.belongsToMany(ProductModel, {
    through: 'user_product_subscriptions',
    as: 'Subscription'
});
ProductModel.belongsToMany(UserModel, {
    through: 'user_product_subscriptions',
    as: 'Subscriber'
});

ProductModel.hasMany(ManualModel);

ManualModel.hasMany(StepModel);

export const User = UserModel;
export const Product = ProductModel;
export const Manual = ManualModel;
export const Step = StepModel;
