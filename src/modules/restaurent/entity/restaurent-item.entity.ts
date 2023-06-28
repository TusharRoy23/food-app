import { Exclude } from "class-transformer";
import { Item } from "../../../modules/item/entity/item.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurent } from "./restaurent.entity";

@Entity()
export class RestaurentItem {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => Restaurent
    )
    restaurent: Restaurent;

    @ManyToOne(
        type => Item
    )
    item: Item;

    @Column({ type: 'float', nullable: false })
    sell_count: number;
}