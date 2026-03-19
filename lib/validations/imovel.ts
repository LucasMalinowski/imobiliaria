import { z } from 'zod'

export const imovelSchema = z.object({
  titulo: z
    .string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  slug: z
    .string()
    .min(3, 'Slug deve ter pelo menos 3 caracteres')
    .max(200, 'Slug deve ter no máximo 200 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hifens')
    .optional(),
  descricao: z
    .string()
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .optional(),
  preco: z
    .number({ invalid_type_error: 'Preço inválido' })
    .positive('Preço deve ser maior que zero'),
  finalidade: z.enum(['venda', 'aluguel'], {
    errorMap: () => ({ message: 'Selecione a finalidade do imóvel' }),
  }),
  tipo: z.enum(
    ['casa', 'apartamento', 'terreno', 'comercial', 'rural', 'cobertura', 'studio', 'sobrado', 'chacara', 'galpao'],
    { errorMap: () => ({ message: 'Selecione o tipo do imóvel' }) }
  ),
  status: z.enum(['disponivel', 'vendido', 'alugado', 'reservado'], {
    errorMap: () => ({ message: 'Selecione o status do imóvel' }),
  }),
  destaque: z.boolean().default(false),
  endereco: z.string().max(300, 'Endereço muito longo').optional(),
  cidade: z.string().max(100, 'Cidade muito longa').optional(),
  bairro: z.string().max(100, 'Bairro muito longo').optional(),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
    .optional()
    .or(z.literal('')),
  quartos: z
    .number({ invalid_type_error: 'Número de quartos inválido' })
    .int('Deve ser número inteiro')
    .min(0, 'Mínimo 0')
    .max(50, 'Máximo 50')
    .default(0),
  banheiros: z
    .number({ invalid_type_error: 'Número de banheiros inválido' })
    .int('Deve ser número inteiro')
    .min(0, 'Mínimo 0')
    .max(50, 'Máximo 50')
    .default(0),
  vagas: z
    .number({ invalid_type_error: 'Número de vagas inválido' })
    .int('Deve ser número inteiro')
    .min(0, 'Mínimo 0')
    .max(100, 'Máximo 100')
    .default(0),
  area_total: z
    .number({ invalid_type_error: 'Área inválida' })
    .positive('Área deve ser maior que zero')
    .optional()
    .nullable(),
  area_construida: z
    .number({ invalid_type_error: 'Área inválida' })
    .positive('Área deve ser maior que zero')
    .optional()
    .nullable(),
  observacoes_internas: z
    .string()
    .max(2000, 'Observações muito longas')
    .optional(),
  publicado: z.boolean().default(false),
})

export type ImovelFormData = z.infer<typeof imovelSchema>
