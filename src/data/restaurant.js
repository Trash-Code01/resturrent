export const seatingOptions = [
  {
    id: 'main_dining',
    label: 'Main Dining Room',
    description: 'The vibrant heart of Obsidian with the full evening energy.',
  },
  {
    id: 'chefs_counter',
    label: "Chef's Counter",
    description: 'Front-row seating for the theatre of the kitchen.',
  },
  {
    id: 'private_booth',
    label: 'Private Booth',
    description: 'An intimate corner for celebrations and quieter dinners.',
  },
];

export const experienceOptions = [
  {
    id: 'a_la_carte',
    label: 'A La Carte',
    priceLabel: 'Varies',
    description: 'Order from the full menu when you arrive.',
  },
  {
    id: 'tasting_menu',
    label: 'Signature Tasting',
    priceLabel: '$250 / guest',
    description: 'A nine-course journey through the kitchen’s highlights.',
  },
  {
    id: 'wine_pairing',
    label: 'Tasting + Wine Pairing',
    priceLabel: '$395 / guest',
    description: 'The full tasting experience with curated pairings.',
  },
];

export const reservationStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const contactStatuses = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const timeSlots = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

export const preOrderMenu = [
  {
    id: 'm1',
    name: 'Truffle Caviar Pasta',
    price: 120,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055106/ChatGPT_Image_May_5_2026_09_50_18_PM-Photoroom_og2hx2.png',
  },
  {
    id: 'm2',
    name: 'Wagyu Tomahawk',
    price: 210,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_1_-Photoroom_cfnjii.png',
  },
  {
    id: 'm3',
    name: 'Gold Leaf Lobster',
    price: 185,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_4_-Photoroom_wy0w0p.png',
  },
  {
    id: 'm4',
    name: 'Black Cod Miso',
    price: 145,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055106/ChatGPT_Image_May_5_2026_09_50_18_PM-Photoroom_og2hx2.png',
  },
  {
    id: 'm5',
    name: "Duck Breast a l'Orange",
    price: 150,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_1_-Photoroom_cfnjii.png',
  },
  {
    id: 'm6',
    name: 'Chocolate Gold Lava Cake',
    price: 65,
    image:
      'https://res.cloudinary.com/dicb5gkab/image/upload/v1778055101/ChatGPT_Image_May_6_2026_01_25_36_PM_4_-Photoroom_wy0w0p.png',
  },
];

export function getSeatingLabel(seatingId) {
  return (
    seatingOptions.find((option) => option.id === seatingId)?.label ?? seatingId
  );
}

export function getExperienceLabel(experienceId) {
  return (
    experienceOptions.find((option) => option.id === experienceId)?.label ??
    experienceId
  );
}
