import { IsString } from "class-validator";

export class CreatePaymentMethodDto {
    @IsString()
    payment_method_name: string;
}
