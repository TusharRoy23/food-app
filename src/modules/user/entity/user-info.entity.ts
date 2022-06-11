import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { validateOrReject } from "class-validator";
import { classToPlain, Exclude } from "class-transformer";

@Entity()
export class UserInfo {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @Column({ type: 'varchar' })
    uuid: string;

    @Column({ nullable: true, type: 'varchar' })
    name: string;

    @Column({ nullable: true, type: 'text' })
    address: string;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

    toJSON() {
        return classToPlain(this);
    }
}