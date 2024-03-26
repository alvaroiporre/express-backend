import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity } from "../../domain";

export class CategoryService {

  constructor() {}

  async createCategory (createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name })
    if ( categoryExists ) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id
      })
      await category.save();
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  async getCategories (user: UserEntity) {
    try {
      const categories = CategoryModel.find({user: user.id});
      if ( !categories ) return [];
      return (await categories).map(category => ({
        id: category.id, 
        name: category.name, 
        available: category.available,
      }));
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }
}