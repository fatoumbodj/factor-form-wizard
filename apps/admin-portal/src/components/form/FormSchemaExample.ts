import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().nonempty("Email obligaotire"),
  password: z.string().nonempty("Mot de passe obligaotire"),
});
