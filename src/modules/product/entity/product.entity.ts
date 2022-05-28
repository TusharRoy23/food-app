import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, Min, validateOrReject } from 'class-validator';
import { Restaurent } from '../../restaurent/entity/restaurent.entity';
import { ProductStatus } from '../../../shared/utils/enum';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'int', default: 0 })
    @IsInt()
    @Min(0)
    quantity: number;

    @ManyToOne(() => Restaurent, (restaurent) => restaurent.products)
    restaurent: Restaurent;

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.WAITING
    })
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdDate: Date;

    @CreateDateColumn({ type: 'timestamp' })
    updatedDate: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}