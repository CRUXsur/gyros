import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn,
    JoinColumn 
  } from 'typeorm';
  import { Cliente } from '../../clientes/entities/cliente.entity';
  import { User } from '../../auth/entities/user.entity';
  
  @Entity('automation_logs')
  export class AutomationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    deviceId: string;
  
    @Column('text')
    action: string;
  
    @Column('json', { nullable: true })
    result: any;
  
    @CreateDateColumn()
    timestamp: Date;
  
    @Column('bool', { default: false })
    success: boolean;
  
    @Column('text', { nullable: true })
    notes?: string;
  
  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn()
  cliente?: Cliente;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;
  }