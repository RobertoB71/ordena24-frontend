export type Category = {
  name: string;
  icon: string;
};

export type PopularProduct = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  time: string;
};

export const categories: Category[] = [
  { name: "Hamburguesas", icon: "🍔" },
  { name: "Pizzas", icon: "🍕" },
  { name: "Pastas", icon: "🍝" },
  { name: "Ensaladas", icon: "🥗" },
  { name: "Tacos", icon: "🌮" },
  { name: "Postres", icon: "🍰" },
  { name: "Bebidas", icon: "🥤" },
];

export const popularProducts: PopularProduct[] = [
  {
    id: 1,
    name: "Burger Clásico",
    category: "Hamburguesas",
    description: "Jugosa hamburguesa 200g con queso cheddar, lechuga, tomate y cebolla caramelizada.",
    price: "€8.99",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    time: "20-30 min",
  },
  {
    id: 2,
    name: "Pizza Margherita",
    category: "Pizzas",
    description: "Pizza napolitana con salsa de tomate San Marzano, mozzarella fresca y albahaca.",
    price: "€12.99",
    imageUrl:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
    time: "20-30 min",
  },
  {
    id: 3,
    name: "Pasta Carbonara",
    category: "Pastas",
    description: "Espaguetis al dente con panceta crujiente, yema de huevo y queso pecorino.",
    price: "€10.50",
    imageUrl:
      "https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?auto=format&fit=crop&w=900&q=80",
    time: "20-30 min",
  },
  {
    id: 4,
    name: "Tacos de Barbacoa",
    category: "Tacos",
    description: "Tres tacos de maíz artesanal con barbacoa de res, cebolla, cilantro y limón.",
    price: "€9.50",
    imageUrl:
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=80",
    time: "20-30 min",
  },
];

export const stats = [
  { value: "2,400+", label: "Clientes felices" },
  { value: "50+", label: "Platos disponibles" },
  { value: "30 min", label: "Tiempo promedio" },
  { value: "4.9★", label: "Valoración media" },
];
