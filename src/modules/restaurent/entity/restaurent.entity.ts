import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CurrentStatus } from '../../../shared/utils/enum';
import { User } from '../../user/entity/user.entity';
import { Item } from '../../item/entity/item.entity';
import { Cart } from '../../cart/entity/cart.entity';

@Entity()
export class Restaurent {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ type: 'varchar' })
    uuid: string;

    @Column({ type: 'varchar' })
    @Index({ unique: true })
    name: string;

    @Column({ type: 'text' })
    address: string;

    @OneToMany(
        type => User,
        user => user.restaurent,
        { eager: false }
    )
    user: User[];

    @OneToMany(
        type => Item,
        item => item.restaurent,
    )
    item: Item[];

    @OneToMany(
        type => Cart,
        cart => cart.restaurent
    )
    cart: Cart[];

    @Column({ nullable: true, type: 'text' })
    profile_img: string;

    @Column({ nullable: false, type: 'time' })
    opening_time: string;

    @Column({ nullable: false, type: 'time' })
    closing_time: string;

    @Column({
        type: 'enum',
        enum: CurrentStatus,
        default: CurrentStatus.NOT_VERIFIED
    })
    current_status: string;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

    toJSON() {
        return classToPlain(this);
    }
}