export interface Teacher {
  id: string;
  name: string;
  subjectIds: string[];
  avatar: string;
  bio: string;
  price: number;
  availableSlots: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Mohamed',
    subjectIds: ['math'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Professor of Advanced Mathematics with 10+ years helping students excel.',
    price: 250,
    availableSlots: ['Saturday 4:00 PM', 'Monday 6:00 PM', 'Wednesday 8:00 PM']
  },
  {
    id: '2',
    name: 'Eng. Sarah Hassan',
    subjectIds: ['physics', 'math'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Software engineer and physics tutor making mechanics simple and intuitive.',
    price: 200,
    availableSlots: ['Sunday 2:00 PM', 'Tuesday 5:00 PM', 'Thursday 7:00 PM']
  }
];

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', icon: '📐' },
  { id: 'physics', name: 'Physics', icon: '⚡' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪' }
];