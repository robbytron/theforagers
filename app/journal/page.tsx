import type { Metadata } from 'next';
import Nav from '@/components/ui/Nav';
import { getAllJournalEntries } from '@/lib/airtable';
import JournalClient from './JournalClient';

export const metadata: Metadata = {
  title: 'The Journal | The Foragers',
  description: 'Seasonal notes, foraging stories, essays on landscape, and cooking with wild food.',
};

export const revalidate = 3600;

export default async function JournalPage() {
  const entries = await getAllJournalEntries();

  return (
    <>
      <Nav />
      <JournalClient entries={entries} />
    </>
  );
}
