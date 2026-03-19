import Link from 'next/link'
import { Home, Building2, MapPin, Store, Leaf, Star } from 'lucide-react'

const tipos = [
  {
    icon: Home,
    label: 'Casas',
    query: '/imoveis?tipo=casa',
    color: 'bg-blue-50 text-blue-600',
    hoverColor: 'hover:bg-blue-600 hover:text-white',
    borderColor: 'border-blue-100',
  },
  {
    icon: Building2,
    label: 'Apartamentos',
    query: '/imoveis?tipo=apartamento',
    color: 'bg-purple-50 text-purple-600',
    hoverColor: 'hover:bg-purple-600 hover:text-white',
    borderColor: 'border-purple-100',
  },
  {
    icon: MapPin,
    label: 'Terrenos',
    query: '/imoveis?tipo=terreno',
    color: 'bg-green-50 text-green-600',
    hoverColor: 'hover:bg-green-600 hover:text-white',
    borderColor: 'border-green-100',
  },
  {
    icon: Store,
    label: 'Comercial',
    query: '/imoveis?tipo=comercial',
    color: 'bg-amber-50 text-amber-600',
    hoverColor: 'hover:bg-amber-600 hover:text-white',
    borderColor: 'border-amber-100',
  },
  {
    icon: Leaf,
    label: 'Rural',
    query: '/imoveis?tipo=rural',
    color: 'bg-emerald-50 text-emerald-600',
    hoverColor: 'hover:bg-emerald-600 hover:text-white',
    borderColor: 'border-emerald-100',
  },
  {
    icon: Star,
    label: 'Coberturas',
    query: '/imoveis?tipo=cobertura',
    color: 'bg-rose-50 text-rose-600',
    hoverColor: 'hover:bg-rose-600 hover:text-white',
    borderColor: 'border-rose-100',
  },
]

export function PropertyTypeGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-500 mb-4">
            Explore por Tipo de Imóvel
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Encontre o imóvel ideal para você. Selecione o tipo que deseja e
            descubra as melhores opções disponíveis.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {tipos.map(({ icon: Icon, label, query, color, hoverColor, borderColor }) => (
            <Link
              key={query}
              href={query}
              className={`group flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border ${borderColor} shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} ${hoverColor} transition-all duration-300 group-hover:scale-110`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-500 transition-colors text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
