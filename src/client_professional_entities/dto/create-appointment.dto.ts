import { Type } from "class-transformer";
import { Client } from "../../clients/entities/client.entity";
import { Professional } from "../../professionals/entities/professional.entity";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Payment_method } from "../../general_resources/entities/payment_method.entity";

export class CreateAppointmentDto {

    @IsNumber()
    date: number;

    @IsString()
    location: string;

    @IsString()
    hour: string;

    @IsString()
    service: string;

    @ValidateNested()
    @Type(() => Client)
    client: Client

    @ValidateNested()
    @Type(() => Professional)
    professional: Professional
    
    @ValidateNested()
    @Type(() => Payment_method)
    payment_method: Payment_method

}

