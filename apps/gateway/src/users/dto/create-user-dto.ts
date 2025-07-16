import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
}