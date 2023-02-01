import { LectureStatus } from "src/shared/enum/lecture-status.enum";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Franchisee } from "./franchisee.entity";
import { User } from "./user.entity";

@Entity()
export class Lecture extends EntityBase {
    @Column({ nullable: false })
    Name!: string;

    @Column({ nullable: false })
    EventDate!: Date;

    @ManyToOne(_type => User, user => user.lectures, { nullable: false })
    lecturer!: User;

    @Column({ default: LectureStatus.OPEN })
    Status: LectureStatus;

    @ManyToOne(_type => Franchisee, franchisee => franchisee.lectures, { nullable: false })
    Franchisee!: Franchisee;
}