import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, validateOrReject } from 'class-validator';
import { hashPassword, isPasswordMatch } from '../../../shared/utils/password.utils';
import { classToPlain, Exclude } from 'class-transformer';
import { CurrentStatus, UserRole, UserType } from '../../../shared/utils/enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar' })
    uuid: string;

    @Column({ nullable: false, type: 'varchar' })
    @Index({ unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: false, type: 'varchar' })
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ nullable: true, type: 'int'})
    restaurent_id: number;

    @Column({ 
        type: 'enum',
        enum: UserType,
        default: UserType.VISITOR
    })
    user_type: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.NONE
    })
    role: string;

    @Column({ 
        nullable: false, 
        type:'enum', 
        default: CurrentStatus.ACTIVE 
    })
    current_status: CurrentStatus;

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