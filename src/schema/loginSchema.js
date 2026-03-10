import { z } from 'zod';
export const loginSchema=z.object({
    email:z.string().nonempty('Email is required').email({message:'Invalid email address'}), 
    password:z.string().nonempty('Password is required').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});