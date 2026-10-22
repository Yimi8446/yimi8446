import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'toys',
    name: 'Juguetes & Juegos',
    iconName: 'Gamepad2',
    color: 'text-amber-600',
    bgGradient: 'from-amber-400 via-orange-400 to-yellow-300',
    borderColor: 'border-amber-300',
    description: 'Autos a control, dinosaurios, muñecas, peluches y superhéroes.',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'birthdays',
    name: 'Fiestas y Cumpleaños',
    iconName: 'PartyPopper',
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 via-rose-400 to-amber-300',
    borderColor: 'border-pink-300',
    description: 'Cajas sorpresa mágicas, globos, combos de regalos y accesorios divertidos.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'quince',
    name: '15 Años (Quinceañeras)',
    iconName: 'Crown',
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 via-pink-400 to-indigo-300',
    borderColor: 'border-purple-300',
    description: 'Joyeros de luces, sets de belleza, recuerdos dorados y regalos elegantes.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'educational',
    name: 'Educativos & STEM',
    iconName: 'Sparkles',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-400 via-teal-400 to-cyan-300',
    borderColor: 'border-emerald-300',
    description: 'Kits de experimentos, robótica, rompecabezas 3D y juegos de ingenio.',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'babyshower',
    name: 'Baby Shower & Bebés',
    iconName: 'Baby',
    color: 'text-sky-600',
    bgGradient: 'from-sky-400 via-blue-400 to-indigo-300',
    borderColor: 'border-sky-300',
    description: 'Sonajeros, morderas, proyectores de estrellas, gimnastas y ajuares.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'weddings',
    name: 'Bodas & Aniversarios',
    iconName: 'HeartHandshake',
    color: 'text-rose-600',
    bgGradient: 'from-rose-500 via-red-400 to-pink-300',
    borderColor: 'border-rose-300',
    description: 'Copas de brindis personalizadas, cajas de recuerdos y detalles para parejas.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'
  }
];

export const CITIES_BOLIVIA = [
  { name: 'La Paz', deliveryCostBob: 15, deliveryTime: '24 hrs o Mismo Día' },
  { name: 'El Alto', deliveryCostBob: 15, deliveryTime: '24 hrs' },
  { name: 'Santa Cruz', deliveryCostBob: 25, deliveryTime: '24-48 hrs' },
  { name: 'Cochabamba', deliveryCostBob: 20, deliveryTime: '24-48 hrs' },
  { name: 'Sucre', deliveryCostBob: 25, deliveryTime: '48 hrs' },
  { name: 'Tarija', deliveryCostBob: 25, deliveryTime: '48 hrs' },
  { name: 'Oruro', deliveryCostBob: 20, deliveryTime: '24-48 hrs' },
  { name: 'Potosí', deliveryCostBob: 25, deliveryTime: '48 hrs' },
  { name: 'Trinidad', deliveryCostBob: 30, deliveryTime: '48-72 hrs' },
  { name: 'Cobija', deliveryCostBob: 35, deliveryTime: '48-72 hrs' },
] as const;
