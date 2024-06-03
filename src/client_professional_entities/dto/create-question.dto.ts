import { Type } from "class-transformer";
import { Client } from "../../clients/entities/client.entity";
import { Professional } from "../../professionals/entities/professional.entity";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { PaymentMethod } from "src/general_resources/entities/payment_method.entity";

export class CreateQuestionDto {

    @IsString()
    title: string;

    @IsString()
    question_description: string;

    

}

