import { z } from 'zod'

export const leadSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .email('E-mail inválido')
    .optional()
    .or(z.literal('')),
  telefone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(20, 'Telefone muito longo')
    .regex(/[\d\s\(\)\-\+]+/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  mensagem: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem muito longa')
    .optional()
    .or(z.literal('')),
  imovel_id: z.string().uuid().optional(),
  imovel_titulo: z.string().optional(),
}).refine(
  (data) => data.email || data.telefone,
  {
    message: 'Informe pelo menos um e-mail ou telefone para contato',
    path: ['email'],
  }
)

export type LeadFormData = z.infer<typeof leadSchema>
