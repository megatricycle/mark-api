import UserModel from './user';
import ProductModel from './product';
import ManualModel from './manual';
import StepModel from './step';
import ObjectModelModel from './objectModel';
import ImageTargetModel from './imageTarget';

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
ProductModel.hasMany(ImageTargetModel);

ManualModel.hasMany(StepModel);

StepModel.hasMany(ObjectModelModel);

export const User = UserModel;
export const Product = ProductModel;
export const Manual = ManualModel;
export const Step = StepModel;
export const ObjectModel = ObjectModelModel;
export const ImageTarget = ImageTargetModel;
