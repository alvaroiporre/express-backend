export class CreateProductDto {
  private constructor (
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // ID of user
    public readonly category: string, // ID of category
  ) {}

  static create( props: { [key: string]: any}): [string?, CreateProductDto?] {
    const {
      name,
      available,
      price,
      description,
      user,
      category
    } = props;

    if ( !name ) return ['Missing name'];
    if ( !user ) return ['Missing user']; 
    if ( !category ) return ['Missing category']; 

    return [undefined, 
      new CreateProductDto(
        name, 
        !!available, 
        price,
        description,
        user,
        category
        )];
  }
}