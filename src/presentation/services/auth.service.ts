import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";
import { bcrypAdapter } from "../../config";

export class AuthService {


  constructor () {}


  public registerUer = async ( registerUserDto: RegisterUserDto ) => {
    const existUser = await UserModel.findOne({email: registerUserDto.email})

    if ( existUser ) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerUserDto);
      
      // Crypt pass
      user.password = bcrypAdapter.hash(registerUserDto.password);
      await user.save();
      // JWT to keep auth

      // Confiramation Email
      const { password, ...rest } = UserEntity.fromObject(user);

      return {user: rest, token: 'abc'};
    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  public loginUer = async ( loginUserDto: LoginUserDto ) => {
    const existUser = await UserModel.findOne({email: loginUserDto.email})

    if ( !existUser ) throw CustomError.badRequest('User does not exist');

    if (!bcrypAdapter.compare(loginUserDto.password, existUser.password)) throw CustomError.badRequest('User or Password incorrect');

    const { password, ...rest } = UserEntity.fromObject(existUser);

    return {
      user: rest,
      token: 'abc'
    }
    
  }

}