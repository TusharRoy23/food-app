import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, validateOrReject } from 'class-validator';
import { Restaurent } from '../../restaurent/entity/restaurent.entity';
import { hashPassword, isPasswordMatch } from '../../../shared/utils/password.utils';
import { UserRole } from '../../../shared/utils/enum';
import { classToPlain, Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @Index({ unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: false })
    @Exclude({ toPlainOnly: true })
    password: string;

    @OneToOne(
        () => Restaurent,
        {
            nullable: true,
        },
        //(restaurent) => restaurent.users
    )
    @JoinColumn()
    restaurent: Restaurent;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.VISITOR
    })
    role: string;

    toJSON() {
        return classToPlain(this);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }

    async doPasswordhashing(password: string): Promise<string> {
        return await hashPassword(password);
    }

    async validatePassword(password: string, hashPassword: string): Promise<boolean> {
        return await isPasswordMatch(hashPassword, password);
    }
}