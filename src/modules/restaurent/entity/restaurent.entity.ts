import { validateOrReject } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Restaurent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    @Index({ unique: true })
    name: string;

    @Column({ type: 'text' })
    address: string;

    @OneToMany(() => Product, (product) => product.restaurent)
    products: Product[];

    @OneToMany(() => User, (user) => user.restaurent)
    users: User[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}