import { Role } from "src/shared/enum/role.enum";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Franchisee } from "./franchisee.entity";
import { Lecture } from "./lecture.entity";

@Entity()
export class User extends EntityBase {
    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ unique: true })
    emailAddress: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({
        type: "enum",
        enum: Role,
        array: true,
        default: []
    })
    roles: Role[]

    @OneToOne(() => Franchisee, { eager: true })
    @JoinColumn()
    adminFranchisee?: Franchisee;

    @ManyToOne(_type => Franchisee, franchise => franchise.lecturers, { eager: true })
    lecturerFranchisee?: Franchisee; // If user is a lecturer, this will contain the related franchisee

    @ManyToOne(_type => Franchisee, franchise => franchise.students, { eager: true })
    studentFranchisee?: Franchisee; // If user is a student, this column will contain the related franchisee -- one user can be student and lecturer at the sametime

    @OneToMany(_type => Lecture, lecture => lecture.lecturer, { cascade: ['soft-remove'] })
    lecturesForTeach: Lecture[]; // If Lecturer will be softremoved, then lecture also will be softremove.

    @ManyToMany(_type => Lecture, lecture => lecture.students)
    @JoinTable()
    lecturesForStudy: Lecture[]

    @BeforeInsert()
    @BeforeUpdate()
    validateFranchisee() { // If user is superadmin then it doesn't need to related a franchisee
        if (!this.lecturerFranchisee && !this.studentFranchisee && !this.roles.includes(Role.SuperAdmin)) {
            throw new Error('User must relate a franchisee');
        }
    }
    validateRoleRequirements() {
        if (this.roles.includes(Role.Admin) && !this.adminFranchisee) {
            throw new Error('The adminFranchise field of a user whose role is Admin cannot be empty. ')
        }
        if (this.roles.includes(Role.Lecturer) && !this.lecturerFranchisee) {
            throw new Error('The lecturerFranchisee field of a user whose role is Admin cannot be empty. ')
        }
        if (this.roles.includes(Role.Student) && !this.studentFranchisee) {
            throw new Error('The studentFranchisee field of a user whose role is Admin cannot be empty. ')
        }
    }

}