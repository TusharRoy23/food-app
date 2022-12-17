import { classToPlain, Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ItemType, ItemStatus, MealType, MealState, MealFlavor } from "../../../shared/utils/enum";
import { Restaurent } from "../../restaurent/entity/restaurent.entity";

@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @Column({ nullable: false, type: 'varchar' })
    name: string;

    @Column({ nullable: true, type: 'text' })
    icon: string;

    @Column({ nullable: true, type: 'text' })
    image: string;

    @Column({
        type: 'enum',
        enum: ItemType,
        default: ItemType.FOOD
    })
    item_type: string;

    @Column({
        type: 'enum',
        enum: MealType,
        default: MealType.FASTFOOD
    })
    meal_type: string;

    @Column({
        type: 'enum',
        enum: MealState,
        default: MealState.HOT
    })
    meal_state: string;

    @Column({
        type: 'enum',
        enum: MealFlavor,
        default: MealFlavor.SWEET
    })
    meal_flavor: string;

    @ManyToOne(
        type => Restaurent,
        restaurent => restaurent.item,
        { eager: true }
    )
    restaurent?: Restaurent;

    @Column({ nullable: false, type: 'float', default: 0 })
    price: number;

    @Column({ nullable: true, type: 'float', default: 0 })
    max_order_qty?: number;

    @Column({ nullable: true, type: 'float', default: 0 })
    min_order_qty?: number;

    @Column({ nullable: true, type: 'float', default: 0 })
    discount_rate?: number;

    @Column({ nullable: true, type: 'timestamp' })
    created_date?: string;

    @Column({
        type: 'enum',
        enum: ItemStatus,
        default: ItemStatus.ACTIVE
    })
    item_status: string;

    toJSON() {
        return classToPlain(this);
    }
}