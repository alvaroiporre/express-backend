import { CustomError, RegisterUserDto } from "../../domain";
import { UserModel } from "../../data";

export class AuthService {


  constructor () {}


  public registerUer = async ( registerUserDto: RegisterUserDto ) => {
    const existUser = await UserModel.findOne({email: registerUserDto.email})

    if ( existUser ) throw CustomError.badRequest('Email already exist');

    return 'todo ok!';
  }

}