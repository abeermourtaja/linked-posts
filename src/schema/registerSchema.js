import { z } from 'zod';
export const registerSchema=z.object({
    name:z.string().min(1,'Name is required'),
    username:z.string().optional(),
    email:z.string().email('Invalid email address'), 
   gender:z.enum(['male','female'],{errorMap:()=>({message:'Gender is required'})}),
    dateOfBirth:z.string().nonempty('Date of Birth is required'),
    password:z.string().min(6,'Password must be at least 6 characters').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    rePassword:z.string().min(6,'Password must be at least 6 characters'),
}).refine((data)=>data.password===data.rePassword,{
    message:'Passwords do not match',
    path:['rePassword']
});