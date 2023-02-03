
export class UpdateFranchiseeDto {
    id: string;
    name: string;
    isActive: boolean;
    credit: number;
    studentIds: string[];
    lectureIds: string[];
    lecturerIds: string[];
}