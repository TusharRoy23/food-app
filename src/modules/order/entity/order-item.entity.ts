import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { classToPlain, Exclude } from "class-transformer";
import { Order } from "./order.entity";
import { Item } from "../../../modules/item/entity/item.entity";

@Entity()
export class OrderItem extends BaseEntity {
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

    @Column({ nullable: false, type: 'float' })
    total_amount: number;

    toJSON() {
        return classToPlain(this);
    }
}