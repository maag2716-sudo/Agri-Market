export const CATEGORIES = [
  { id: 'verduras', name: 'Verduras y Hortalizas', emoji: '🥦', color: '#40916c' },
  { id: 'frutas', name: 'Frutas Frescas', emoji: '🍎', color: '#e76f51' },
  { id: 'granos', name: 'Granos y Cereales', emoji: '🌾', color: '#dda15e' },
  { id: 'hierbas', name: 'Hierbas y Especias', emoji: '🌿', color: '#606c38' },
  { id: 'lacteos', name: 'Lácteos Artesanales', emoji: '🥛', color: '#fefae0' },
  { id: 'huevos', name: 'Huevos de Granja', emoji: '🥚', color: '#ddb892' },
  { id: 'miel', name: 'Miel y Productos Apícolas', emoji: '🍯', color: '#f4a261' },
  { id: 'aceites', name: 'Aceites y Vinagres Artesanales', emoji: '🫒', color: '#283618' },
  { id: 'plantas', name: 'Plantas y Semillas', emoji: '🌱', color: '#52b788' },
  { id: 'carnes', name: 'Carnes de Granja', emoji: '🐄', color: '#bc6c25' },
  { id: 'general', name: 'Mercado General', emoji: '🏪', color: '#2d6a4f' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
