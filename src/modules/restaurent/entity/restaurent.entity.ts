import { validateOrReject } from 'class-validator';
import { CurrentStatus } from '../../../shared/utils/enum';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Restaurent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @Column({ type: 'varchar' })
    @Index({ unique: true })
    name: string;

    @Column({ type: 'text' })
    address: string;

    @Column({ type: 'int', nullable: false })
    creator_id: number;

    @Column({ nullable: true, type: 'text'})
    profile_img: string;

    @Column({ nullable: false, type: 'time' })
    opening_time: string;

    @Column({ nullable: false, type: 'time' })
    closing_time: string;

    @Column({
        type: 'enum',
        enum: CurrentStatus,
        default: CurrentStatus.INACTIVE
    })
    current_status: string;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}