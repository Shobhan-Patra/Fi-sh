export function generateRoomId() {
  const sample = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let roomId = '';
  for (let i = 0; i < 6; i++) {
    roomId += sample[Math.floor(Math.random() * sample.length)];
  }
  return roomId;
}

export function getCurrentDateTimeFormatted(increment = 0) {
  return new Date(Date.now() + increment)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
}

export function generateRandomUserName() {
  const colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'White',
    'Black',
    'Indigo',
    'Violet',
    'Orange',
    'Teal',
    'Cyan',
    'Neon',
    'Pink',
    'Beige',
    'Majenta',
    'Turquoise',
    'Maroon',
    'Silver',
    'Olive',
    'Peach',
    'Gray',
  ];
  const animals = [
    'Elephant',
    'Zebra',
    'Tiger',
    'Fox',
    'Bear',
    'Cat',
    'Dog',
    'Cow',
    'Giraffe',
    'Lion',
    'Deer',
    'Donkey',
    'Buffalo',
    'Hyena',
    'Wolf',
    'Horse',
    'Rabbit',
    'Goat',
    'Sheep',
    'Frog',
    'Dolphin',
    'Camel',
  ];

  let username = '';
  username += colors[Math.floor(Math.random() * colors.length)];
  username += ' ' + animals[Math.floor(Math.random() * animals.length)];
  // username += ' ' + fruits[Math.floor(Math.random() * fruits.length)];

  return username;
}
