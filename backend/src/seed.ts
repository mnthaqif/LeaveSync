import pool from './config/database';
import { format, addDays } from 'date-fns';

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');
    
    // Clear existing data
    await pool.query('DELETE FROM leave_record');
    await pool.query('DELETE FROM public_holiday');
    await pool.query('DELETE FROM user');
    
    console.log('✓ Cleared existing data');
    
    // Seed users
    const users = [
      { name: 'Ahmad Bin Ali', email: 'ahmad@company.com', department: 'Engineering', state: 'Selangor' },
      { name: 'Siti Nurhaliza', email: 'siti@company.com', department: 'Marketing', state: 'Selangor' },
      { name: 'Raj Kumar', email: 'raj@company.com', department: 'Engineering', state: 'Penang' },
      { name: 'Mei Ling Wong', email: 'meiling@company.com', department: 'HR', state: 'Kuala Lumpur' },
      { name: 'Fatimah Hassan', email: 'fatimah@company.com', department: 'Finance', state: 'Johor' },
      { name: 'David Tan', email: 'david@company.com', department: 'Engineering', state: 'Selangor' },
      { name: 'Nora Abdullah', email: 'nora@company.com', department: 'Sales', state: 'Penang' },
      { name: 'Kumar Selvam', email: 'kumar@company.com', department: 'Operations', state: 'Kuala Lumpur' }
    ];
    
    for (const user of users) {
      await pool.query(
        'INSERT INTO user (name, email, department, state) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.department, user.state]
      );
    }
    
    console.log(`✓ Seeded ${users.length} users`);
    
    // Seed some sample public holidays for 2024-2025
    const holidays = [
      // 2024
      { date: '2024-01-01', state: 'National', name: 'New Year\'s Day' },
      { date: '2024-01-25', state: 'National', name: 'Thaipusam' },
      { date: '2024-02-01', state: 'National', name: 'Federal Territory Day' },
      { date: '2024-02-10', state: 'National', name: 'Chinese New Year' },
      { date: '2024-02-11', state: 'National', name: 'Chinese New Year (Day 2)' },
      { date: '2024-03-28', state: 'National', name: 'Nuzul Al-Quran' },
      { date: '2024-04-10', state: 'National', name: 'Hari Raya Aidilfitri' },
      { date: '2024-04-11', state: 'National', name: 'Hari Raya Aidilfitri (Day 2)' },
      { date: '2024-05-01', state: 'National', name: 'Labour Day' },
      { date: '2024-05-22', state: 'National', name: 'Vesak Day' },
      { date: '2024-06-03', state: 'National', name: 'Yang di-Pertuan Agong\'s Birthday' },
      { date: '2024-06-17', state: 'National', name: 'Hari Raya Aidiladha' },
      { date: '2024-07-07', state: 'National', name: 'Awal Muharram' },
      { date: '2024-08-31', state: 'National', name: 'Merdeka Day' },
      { date: '2024-09-16', state: 'National', name: 'Malaysia Day' },
      { date: '2024-09-16', state: 'National', name: 'Prophet Muhammad\'s Birthday' },
      { date: '2024-10-24', state: 'National', name: 'Deepavali' },
      { date: '2024-12-25', state: 'National', name: 'Christmas' },
      // 2025
      { date: '2025-01-01', state: 'National', name: 'New Year\'s Day' },
      { date: '2025-01-29', state: 'National', name: 'Chinese New Year' },
      { date: '2025-01-30', state: 'National', name: 'Chinese New Year (Day 2)' },
      { date: '2025-03-31', state: 'National', name: 'Hari Raya Aidilfitri' },
      { date: '2025-04-01', state: 'National', name: 'Hari Raya Aidilfitri (Day 2)' },
      { date: '2025-05-01', state: 'National', name: 'Labour Day' },
      { date: '2025-05-12', state: 'National', name: 'Vesak Day' },
      { date: '2025-06-07', state: 'National', name: 'Hari Raya Aidiladha' },
      { date: '2025-06-28', state: 'National', name: 'Awal Muharram' },
      { date: '2025-08-31', state: 'National', name: 'Merdeka Day' },
      { date: '2025-09-16', state: 'National', name: 'Malaysia Day' },
      { date: '2025-10-20', state: 'National', name: 'Deepavali' },
      { date: '2025-12-25', state: 'National', name: 'Christmas' }
    ];
    
    for (const holiday of holidays) {
      await pool.query(
        'INSERT INTO public_holiday (date, state, holiday_name, type) VALUES (?, ?, ?, ?)',
        [holiday.date, holiday.state, holiday.name, 'National']
      );
    }
    
    console.log(`✓ Seeded ${holidays.length} public holidays`);
    
    // Seed some sample leave records
    const today = new Date();
    const leaves = [
      // Normal leave
      { user_id: 1, start_date: format(addDays(today, 5), 'yyyy-MM-dd'), end_date: format(addDays(today, 7), 'yyyy-MM-dd'), notes: 'Family vacation' },
      { user_id: 2, start_date: format(addDays(today, 10), 'yyyy-MM-dd'), end_date: format(addDays(today, 12), 'yyyy-MM-dd'), notes: 'Personal matters' },
      // Connected leave (assuming Friday is a working day in most states)
      { user_id: 3, start_date: format(addDays(today, 14), 'yyyy-MM-dd'), end_date: format(addDays(today, 14), 'yyyy-MM-dd'), notes: 'Long weekend trip' },
      { user_id: 4, start_date: format(addDays(today, 20), 'yyyy-MM-dd'), end_date: format(addDays(today, 22), 'yyyy-MM-dd'), notes: 'Medical appointment' },
    ];
    
    for (const leave of leaves) {
      // Get user state
      const [userRows]: any = await pool.query('SELECT state FROM user WHERE id = ?', [leave.user_id]);
      const userState = userRows[0].state;
      
      // For seeding, we'll just use 'Normal' type for simplicity
      // In production, the API will auto-detect connected leave
      await pool.query(
        'INSERT INTO leave_record (user_id, start_date, end_date, leave_type, notes) VALUES (?, ?, ?, ?, ?)',
        [leave.user_id, leave.start_date, leave.end_date, 'Normal', leave.notes]
      );
    }
    
    console.log(`✓ Seeded ${leaves.length} leave records`);
    
    console.log('✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
