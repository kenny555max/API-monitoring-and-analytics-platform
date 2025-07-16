import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    @IsString()
    reference: string;
}
