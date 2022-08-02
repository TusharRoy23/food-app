import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Item } from "../../../modules/item/entity/item.entity";
import { classToPlain, Exclude } from "class-transformer";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => Item
    )
    item: Item;

    @ManyToOne(
        type => Order,
        order => order.order_item
    )
    order: Order;

    @Column({ nullable: false, type: 'float' })
    qty: number;

    @Column({ nullable: false, type: 'float' })
    amount: number;

    @Column({ nullable: true, type: 'float', default: 0.0 })
    deduction_rate: number;

    toJSON() {
        return classToPlain(this);
    }
}