'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Save, RefreshCw, AlertCircle } from 'lucide-react'
import { imovelSchema, type ImovelFormData } from '@/lib/validations/imovel'
import { createImovel, updateImovel } from '@/lib/actions/imoveis'
import { gerarSlug } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { Imovel } from '@/types'

const tipoOptions = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'studio', label: 'Studio' },
  { value: 'sobrado', label: 'Sobrado' },
  { value: 'chacara', label: 'Chácara' },
  { value: 'galpao', label: 'Galpão' },
]

const statusOptions = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'alugado', label: 'Alugado' },
  { value: 'reservado', label: 'Reservado' },
]

interface PropertyFormProps {
  imovel?: Imovel
  mode: 'create' | 'edit'
}

export function PropertyForm({ imovel, mode }: PropertyFormProps) {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [precoDisplay, setPrecoDisplay] = useState(
    imovel ? imovel.preco.toLocaleString('pt-BR') : ''
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ImovelFormData>({
    resolver: zodResolver(imovelSchema),
    defaultValues: imovel
      ? {
          titulo: imovel.titulo,
          slug: imovel.slug,
          descricao: imovel.descricao || '',
          preco: imovel.preco,
          finalidade: imovel.finalidade,
          tipo: imovel.tipo,
          status: imovel.status,
          destaque: imovel.destaque,
          endereco: imovel.endereco || '',
          cidade: imovel.cidade || '',
          bairro: imovel.bairro || '',
          cep: imovel.cep || '',
          quartos: imovel.quartos,
          banheiros: imovel.banheiros,
          vagas: imovel.vagas,
          area_total: imovel.area_total || undefined,
          area_construida: imovel.area_construida || undefined,
          observacoes_internas: imovel.observacoes_internas || '',
          publicado: imovel.publicado,
        }
      : {
          finalidade: 'venda',
          tipo: 'apartamento',
          status: 'disponivel',
          destaque: false,
          publicado: false,
          quartos: 0,
          banheiros: 0,
          vagas: 0,
        },
  })

  const titulo = watch('titulo')

  const handleGenerateSlug = () => {
    if (titulo) {
      setValue('slug', gerarSlug(titulo))
    }
  }

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const num = parseFloat(raw) / 100
    if (!isNaN(num)) {
      setValue('preco', num)
      setPrecoDisplay(
        num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      )
    } else {
      setPrecoDisplay('')
      setValue('preco', 0)
    }
  }

  const onSubmit = async (data: ImovelFormData) => {
    setErrorMessage('')
    try {
      if (mode === 'create') {
        const result = await createImovel(data)
        if (result.success && result.data) {
          router.push(`/admin/imoveis/${result.data.id}/editar`)
        } else {
          setErrorMessage(result.error || 'Erro ao criar imóvel.')
        }
      } else if (imovel) {
        const result = await updateImovel(imovel.id, data)
        if (result.success) {
          router.refresh()
        } else {
          setErrorMessage(result.error || 'Erro ao atualizar imóvel.')
        }
      }
    } catch {
      setErrorMessage('Erro inesperado. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Informações Básicas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input
              label="Título do Imóvel"
              placeholder="Ex: Apartamento 3 dormitórios no centro"
              required
              error={errors.titulo?.message}
              {...register('titulo')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Slug (URL)
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="apartamento-centro"
                {...register('slug')}
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleGenerateSlug}
                icon={<RefreshCw className="w-4 h-4" />}
                title="Gerar slug do título"
              >
                Gerar
              </Button>
            </div>
            {errors.slug && (
              <p className="mt-1.5 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Preço <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                R$
              </span>
              <input
                type="text"
                value={precoDisplay}
                onChange={handlePrecoChange}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.preco && (
              <p className="mt-1.5 text-sm text-red-600">{errors.preco.message}</p>
            )}
          </div>

          <Select
            label="Finalidade"
            required
            error={errors.finalidade?.message}
            options={[
              { value: 'venda', label: 'Venda' },
              { value: 'aluguel', label: 'Aluguel' },
            ]}
            {...register('finalidade')}
          />

          <Select
            label="Tipo de Imóvel"
            required
            error={errors.tipo?.message}
            options={tipoOptions}
            {...register('tipo')}
          />

          <Select
            label="Status"
            required
            error={errors.status?.message}
            options={statusOptions}
            {...register('status')}
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descrição
            </label>
            <textarea
              rows={5}
              placeholder="Descreva o imóvel com detalhes..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              {...register('descricao')}
            />
            {errors.descricao && (
              <p className="mt-1.5 text-sm text-red-600">{errors.descricao.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Localização
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input
              label="Endereço"
              placeholder="Rua, número e complemento"
              error={errors.endereco?.message}
              {...register('endereco')}
            />
          </div>

          <Input
            label="Cidade"
            placeholder="São Paulo"
            error={errors.cidade?.message}
            {...register('cidade')}
          />

          <Input
            label="Bairro"
            placeholder="Moema"
            error={errors.bairro?.message}
            {...register('bairro')}
          />

          <Input
            label="CEP"
            placeholder="00000-000"
            error={errors.cep?.message}
            {...register('cep')}
          />
        </div>
      </div>

      {/* Características */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Características
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <Input
            label="Quartos"
            type="number"
            min="0"
            max="50"
            placeholder="0"
            error={errors.quartos?.message}
            {...register('quartos', { valueAsNumber: true })}
          />

          <Input
            label="Banheiros"
            type="number"
            min="0"
            max="50"
            placeholder="0"
            error={errors.banheiros?.message}
            {...register('banheiros', { valueAsNumber: true })}
          />

          <Input
            label="Vagas"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            error={errors.vagas?.message}
            {...register('vagas', { valueAsNumber: true })}
          />

          <Input
            label="Área Total (m²)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            error={errors.area_total?.message}
            {...register('area_total', { valueAsNumber: true })}
          />

          <Input
            label="Área Construída (m²)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            error={errors.area_construida?.message}
            {...register('area_construida', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          Configurações de Publicação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('publicado')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-primary-500 rounded-full transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Publicar imóvel
                </p>
                <p className="text-xs text-gray-400">
                  Visível no site para visitantes
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('destaque')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-accent-500 rounded-full transition-colors"></div>
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Marcar como destaque
                </p>
                <p className="text-xs text-gray-400">
                  Aparece na página inicial
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Observações Internas
            </label>
            <textarea
              rows={4}
              placeholder="Notas internas (não visível ao público)..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              {...register('observacoes_internas')}
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Submit buttons */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/imoveis')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          icon={<Save className="w-4 h-4" />}
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Criando...'
              : 'Salvando...'
            : mode === 'create'
            ? 'Criar Imóvel'
            : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}
