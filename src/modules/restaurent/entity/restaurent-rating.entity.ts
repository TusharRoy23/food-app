import { Exclude } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../modules/user/entity/user.entity";
import { Restaurent } from "./restaurent.entity";

@Entity()
export class RestaurentRating {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ type: 'varchar' })
    uuid: string;

    @ManyToOne(
        type => Restaurent
    )
    restaurent: Restaurent;

    @ManyToOne(
        type => User
    )
    user: User

    @Column({ type: 'int' })
    star: number;

    @Column({ nullable: false, type: 'timestamp' })
    rating_date: string

}