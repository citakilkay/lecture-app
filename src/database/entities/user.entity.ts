import { Role } from "src/shared/enum/role.enum";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Franchisee } from "./franchisee.entity";
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
    role: Role;

    @OneToMany(_type => Lecture, lecture => lecture.lecturer)
    lectures: Lecture[] = [];

    @ManyToOne(_type => Franchisee, franchise => franchise.lecturers)
    lecturerFranchisee?: Franchisee;

    @ManyToOne(_type => Franchisee, franchise => franchise.students)
    studentFranchisee?: Franchisee;

    @BeforeInsert()
    validateFranchisee() {
        if (!this.lecturerFranchisee || !this.studentFranchisee || this.role != Role.SuperAdmin) {
            throw new Error('User must have a franchisee');
        }
    }
}