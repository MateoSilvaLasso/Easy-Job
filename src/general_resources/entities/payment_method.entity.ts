import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Appointment } from "../../client_professional_entities/entities/appointment.entity";

@Entity()
export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    payment_method_name: string;

    @OneToMany(() => Appointment, (appointment) => appointment.paymentMethod)
    appointments: Appointment[];
}