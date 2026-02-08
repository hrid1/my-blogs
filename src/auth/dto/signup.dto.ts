import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}