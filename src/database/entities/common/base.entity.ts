import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ nullable: false })
    createdAt: Date

    @UpdateDateColumn({ name: 'created_at' })
    updatedAt?: Date

    @DeleteDateColumn({ name: 'updated_at', type: 'timestamp' })
    deletedAt?: Date;
}