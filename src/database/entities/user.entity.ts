import { Role } from "src/shared/enum/role.enum";
import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Lecture } from "./lecture.entity";

@Entity()
export class User extends EntityBase {
    @Column({ unique: true, nullable: false })
    username!: string;

    @Column({ unique: true })
    emailAddress: string;

    @Column({ nullable: false })
    password!: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    Role: Role;

    @OneToMany(_type => Lecture, lecture => lecture.lecturer)
    lectures: Lecture[];
    //Role
    //Francise
}