import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Client } from "../../clients/entities/client.entity";
import { Professional } from "../../professionals/entities/professional.entity";
import { PaymentMethod } from "../../general_resources/entities/payment_method.entity";

@Entity()
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    date: string;  

    @Column({ type: 'text' })
    location: string;

    @Column({ type: 'text' })
    hour: string;

    @Column({ type: 'text' })
    service: string;

    @ManyToOne(() => Client, (client) => client.questions)
    client: Client;

    @ManyToOne(() => Professional, (professional) => professional.appointments)
    professional: Professional;

    @ManyToOne(() => PaymentMethod, (payment_method) => payment_method.appointments)
    paymentMethod: PaymentMethod;  
}
