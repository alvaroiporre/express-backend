import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { UserModel } from "../../data";
import { JwtAdapter, bcrypAdapter } from "../../config";

export class AuthService {
  constructor() {}

  public registerUer = async (registerUserDto: RegisterUserDto) => {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);

      // Crypt pass
      user.password = bcrypAdapter.hash(registerUserDto.password);
      await user.save();
      // JWT to keep auth

      // Confiramation Email
      const { password, ...rest } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });

      if (!token) throw CustomError.internalServer("Error while creating JWT");

      return { user: rest, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };

  public loginUer = async (loginUserDto: LoginUserDto) => {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    if (!user) throw CustomError.badRequest("Email or Password incorrect");

    if (!bcrypAdapter.compare(loginUserDto.password, user.password))
      throw CustomError.badRequest("User or Password incorrect");

    const token = await JwtAdapter.generateToken({ id: user.id });

    if (!token) throw CustomError.internalServer("Error while creating JWT");

    const { password, ...rest } = UserEntity.fromObject(user);

    return {
      user: rest,
      token,
    };
  };
}
