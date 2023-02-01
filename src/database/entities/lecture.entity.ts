import { LectureStatus } from "src/shared/enum/lecture-status.enum";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Franchisee } from "./franchisee.entity";
import { User } from "./user.entity";

@Entity()
export class Lecture extends EntityBase {
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    eventDate!: Date;

    @Column({ default: LectureStatus.OPEN })
    status: LectureStatus;

    @ManyToOne(_type => Franchisee, franchisee => franchisee.lectures, { nullable: false })
    franchisee!: Franchisee;

    @ManyToMany(_type => User, user => user.lecturesForTeach, { nullable: false })
    @JoinTable()
    lecturer!: User;

    @ManyToMany(_type => User, student => student.lecturesForStudy)
    @JoinTable()
    students: User[] = [];

}