import { classToPlain, Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Restaurent } from "../../../modules/restaurent/entity/restaurent.entity";

@Entity()
export class OrderDiscount extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => Restaurent
    )
    restaurent: Restaurent;

    @Column({ nullable: false, type: 'float', default: 100 })
    max_amount: number;

    @Column({ nullable: false, type: 'float', default: 1 })
    min_amount: number;

    @Column({ nullable: false, type: 'float', default: 0 })
    discount_rate: number;

    @Column({ nullable: false, type: 'timestamp' })
    start_date: string;

    @Column({ nullable: false, type: 'timestamp' })
    end_date: string;

    @Column({ nullable: false, type: 'timestamp' })
    created_date?: string;

    toJSON() {
        return classToPlain(this);
    }
}