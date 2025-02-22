import { Request, Response } from 'express';
import  { UserModel, IUser } from '../model/userModel';




// ایجاد کاربر جدید
export const createUser = async (req: Request, res: Response): Promise<void> => {
    console.log(req.body)
    try {
        const {user_phone} = req.body
        const user_exists = await UserModel.findOne({user_phone})
        if (user_exists){
            res.status(200).json({
              exist:true,
              success:true
            })
        }
  
        else{
  
          const user: IUser = await UserModel.create(req.body);
          
          res.status(201).json(
            {
                success:true,
                user:user
            }
          );
        }
  
      } catch (err: any) {
          console.log(err.code)
          res.status(400).json({
            success:false,
            erro:err
          })
        }
  };

// دریافت همه کاربران
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users: IUser[] = await UserModel.find();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// دریافت کاربر با آیدی
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {

        const user: IUser | null = await UserModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// بروزرسانی کاربر
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser | null = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};


// حذف کاربر
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: IUser | null = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};



