import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Item } from "../../item/entity/item.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => Item,
    )
    item?: Item;

    @ManyToOne(
        type => Cart,
        cart => cart.cart_item,
    )
    cart?: Cart;

    @Column({ nullable: false, type: 'float', default: 0.0 })
    qty: number;

    @Column({ nullable: false, type: 'float', default: 0.0 })
    amount: number;

    @Column({ nullable: false, type: 'float', default: 0.0 })
    total_amount: number;

    // @BeforeInsert()
    // @BeforeUpdate()
    // async validate() {
    //     await validateOrReject(this);
    // }

    // toJSON() {
    //     return classToPlain(this);
    // }
}