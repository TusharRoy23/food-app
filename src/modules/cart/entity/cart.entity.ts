import { validateOrReject } from "class-validator";
import { classToPlain, Exclude } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Restaurent } from "../../restaurent/entity/restaurent.entity";
import { User } from "../../user/entity/user.entity";
import { CartStatus } from "../../../shared/utils/enum";
import { CartItem } from "./cart-item.entity";

@Entity()
export class Cart {
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
        type => CartItem,
        cart_item => cart_item.cart
    )
    cart_item: CartItem[];

    @Column({ nullable: false, type: 'float' })
    cart_amount: number;

    @Column({ nullable: false, type: 'timestamp' })
    cart_date: string;

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.SAVED
    })
    cart_status: string;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

    toJSON() {
        return classToPlain(this);
    }
}