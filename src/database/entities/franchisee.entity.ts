import { Column, Entity, OneToMany } from "typeorm"
import { EntityBase } from "./common/base.entity"
import { Lecture } from "./lecture.entity";
import { User } from "./user.entity";

@Entity()
export class Franchisee extends EntityBase {
    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(_type => User, user => user.studentFranchisee)
    students: User[] = []

    @OneToMany(_type => User, user => user.lecturerFranchisee)
    lecturers: User[] = []

    @OneToMany(_type => Lecture, lecture => lecture.Franchisee)
    lectures: Lecture[] = []

    @Column({ default: 0 })
    credit: number
}