import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";

export class AuthService {


  constructor () {}


  public registerUer = async ( registerUserDto: RegisterUserDto ) => {
    const existUser = await UserModel.findOne({email: registerUserDto.email})

    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      await user.save();

      // Crypt pass

      // JWT to keep auth

      // Confiramation Email
      const { password, ...rest } = UserEntity.fromObject(user);

      return {user: rest, token: 'abc'};
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

}