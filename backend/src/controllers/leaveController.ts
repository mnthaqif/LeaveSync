import { Request, Response } from 'express';
import pool from '../config/database';
import { detectConnectedLeave } from '../services/connectedLeaveService';

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const { user_id, department, leave_type, state, start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        l.id, 
        l.user_id, 
        l.start_date, 
        l.end_date, 
        l.leave_type, 
        l.notes,
        l.created_at,
        u.name as user_name,
        u.department,
        u.state
      FROM leave_record l
      JOIN user u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (user_id) {
      query += ' AND l.user_id = ?';
      params.push(user_id);
    }
    
    if (department) {
      query += ' AND u.department = ?';
      params.push(department);
    }
    
    if (leave_type) {
      query += ' AND l.leave_type = ?';
      params.push(leave_type);
    }
    
    if (state) {
      query += ' AND u.state = ?';
      params.push(state);
    }
    
    if (start_date && end_date) {
      query += ' AND (l.start_date <= ? AND l.end_date >= ?)';
      params.push(end_date, start_date);
    }
    
    query += ' ORDER BY l.start_date ASC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leaves', message: error.message });
  }
};

export const createLeave = async (req: Request, res: Response) => {
  try {
    const { user_id, start_date, end_date, notes } = req.body;
    
    if (!user_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'user_id, start_date, and end_date are required' });
    }
    
    // Get user's state
    const [userRows]: any = await pool.query('SELECT state FROM user WHERE id = ?', [user_id]);
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userState = userRows[0].state;
    
    // Detect if leave is connected
    const isConnected = await detectConnectedLeave(start_date, end_date, userState);
    const leaveType = isConnected ? 'Connected' : 'Normal';
    
    // Insert leave
    const [result]: any = await pool.query(
      'INSERT INTO leave_record (user_id, start_date, end_date, leave_type, notes) VALUES (?, ?, ?, ?, ?)',
      [user_id, start_date, end_date, leaveType, notes || null]
    );
    
    // Fetch the created leave with user details
    const [leaveRows]: any = await pool.query(
      `SELECT 
        l.id, 
        l.user_id, 
        l.start_date, 
        l.end_date, 
        l.leave_type, 
        l.notes,
        l.created_at,
        u.name as user_name,
        u.department,
        u.state
      FROM leave_record l
      JOIN user u ON l.user_id = u.id
      WHERE l.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(leaveRows[0]);
  } catch (error: any) {
    console.error('Error creating leave:', error);
    res.status(500).json({ error: 'Failed to create leave', message: error.message });
  }
};

export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [result]: any = await pool.query('DELETE FROM leave_record WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    
    res.json({ message: 'Leave deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting leave:', error);
    res.status(500).json({ error: 'Failed to delete leave', message: error.message });
  }
};
