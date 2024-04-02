import { CategoryModel, ProductModel, UserModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {

  constructor() {}

  async createProduct (createProductDto: CreateProductDto ) {
    const productExists = await ProductModel.findOne({ name: createProductDto.name })
    if ( productExists ) throw CustomError.badRequest('Product already exists');
(createProductDto.category);
    try {
      const product = new ProductModel({
        ...createProductDto,
      })
      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  async getProducts (paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      // const total = await CategoryModel.countDocuments();
      // const categories = await CategoryModel.find({user: user.id})
      //   .skip((page - 1) * limit )
      //   .limit(limit);

      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit )
          .limit(limit)
      ])

      if ( !products ) return [];
      return {
        page,
        limit,
        total,
        next: `/api/categories?page${ page + 1 }&limit${ limit }`,
        prev: (page > 1)? `/api/categories?page${ page - 1 }&limit${ limit }`: null,
        products: products.map(product => ({
        id: product.id,
        name: product.name, 
        available: product.available,
      })),

    }
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }
}