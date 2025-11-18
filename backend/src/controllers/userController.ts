import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, department, state FROM user ORDER BY name ASC'
    );
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query(
      'SELECT id, name, email, department, state FROM user WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
};
