import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum AttendanceAction {
  CHECKIN = 'check_in',
  CHECKOUT = 'check_out',
}

@Entity()
@Unique(['employeeId', 'date', 'action'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ type: 'date' })
  @Index() // for filtering attendance by date
  date: string;

  @Column({ type: 'enum', enum: AttendanceAction })
  action: AttendanceAction;

  @Column({ name: 'occured_at', type: 'datetime' })
  occuredAt: Date;

  @Column({ name: 'photo_filename', nullable: true })
  photoFilename?: string;

  @CreateDateColumn()
  createdAt: Date;
}
