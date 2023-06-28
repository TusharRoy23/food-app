import { classToPlain, Exclude } from "class-transformer";
import { validateOrReject } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Restaurent } from "../../../modules/restaurent/entity/restaurent.entity";
import { User } from "../../../modules/user/entity/user.entity";
import { OrderStatus, PaidBy } from "../../../shared/utils/enum";
import { OrderDiscount, OrderItem } from "./index.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => User
    )
    user: User;

    @ManyToOne(
        type => Restaurent
    )
    restaurent: Restaurent;

    @OneToMany(
        type => OrderItem,
        order_item => order_item.order
    )
    order_item: OrderItem[]

    @ManyToOne(
        type => OrderDiscount
    )
    order_discount: OrderDiscount;

    @Column({ nullable: false, type: 'varchar' })
    serial_number: string;

    @Column({ nullable: false, type: 'float' })
    order_amount: number;

    @Column({ nullable: true, type: 'float', default: 0.0 })
    rebate_amount: number;

    @Column({ nullable: true, type: 'float', default: 0.0 })
    total_amount: number;

    @Column({ nullable: false, type: 'timestamp' })
    order_date: string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    order_status: OrderStatus;

    @Column({
        type: 'enum',
        enum: PaidBy,
        default: PaidBy.CASH_ON_DELIVERY
    })
    paid_by: PaidBy;

    toJSON() {
        return classToPlain(this);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}