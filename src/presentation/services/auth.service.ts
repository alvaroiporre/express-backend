import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { UserModel } from "../../data";
import { JwtAdapter, bcrypAdapter, envs } from "../../config";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

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
      await this.sendEmailValidationLink( user.email );


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

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if ( !token ) throw CustomError.internalServer('Error getting token');

    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;

    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${ link }">Validate your email: ${ email }</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);

    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if ( !payload ) throw CustomError.unAuthorized('Invalid token');

    const { email } = payload as { email: string };
    if ( !email ) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });
    if ( !user ) throw CustomError.internalServer('Email not exist');

    user.emailValidated = true;

    await user.save();
    return true;
  }
}
