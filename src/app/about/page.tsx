import { redirect } from 'next/navigation';

export const metadata = {
  title: 'About | Vital-AI',
  description: 'This route has been removed.',
};

export default function About() {
  // About page has been removed; redirect to home.
  redirect('/');
}
