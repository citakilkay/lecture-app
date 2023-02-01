import { Role } from "src/shared/enum/role.enum";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
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
    role: Role[] = [];

    @ManyToOne(_type => Franchisee, franchise => franchise.lecturers)
    lecturerFranchisee?: Franchisee; // If user is a lecturer, this will contain the related franchisee

    @ManyToOne(_type => Franchisee, franchise => franchise.students)
    studentFranchisee?: Franchisee; // If user is a student, this column will contain the related franchisee -- one user can be student and lecturer at the sametime

    @OneToMany(_type => Lecture, lecture => lecture.lecturer, { cascade: ['soft-remove'] })
    lecturesForTeach: Lecture[] = []; // If Lecturer will be sofremoved, then lecture also will be softremove.

    @ManyToMany(_type => Lecture, lecture => lecture.students)
    @JoinTable()
    lecturesForStudy: Lecture[] = []

    @BeforeInsert()
    validateFranchisee() { // If user is superadmin then it doesn't need to related a franchisee
        if (!this.lecturerFranchisee || !this.studentFranchisee || !this.role.includes(Role.SuperAdmin)) {
            throw new Error('User must related a franchisee');
        }
    }
}