import { classToPlain, Exclude } from "class-transformer";
import { validateOrReject } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "../../item/entity/item.entity";
import { Cart } from "./cart.entity";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => Item,
    )
    item: Item;

    @ManyToOne(
        type => Cart,
        cart => cart.cart_item
    )
    cart: Cart;

    @Column({ nullable: false, type: 'float' })
    qty: number;

    @Column({ nullable: false, type: 'float' })
    amount: number;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

    toJSON() {
        return classToPlain(this);
    }
}