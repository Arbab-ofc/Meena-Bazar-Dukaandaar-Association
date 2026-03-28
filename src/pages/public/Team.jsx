import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import TeamCard from '@/components/common/TeamCard';
import Skeleton from '@/components/ui/Skeleton';
import { getTeamMembers } from '@/services/firestore/teamService';
import { SEED_TEAM_MEMBERS } from '@/data/seedData';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Our Team | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTeamMembers();
        setMembers(data.length ? data : SEED_TEAM_MEMBERS);
      } catch {
        setMembers(SEED_TEAM_MEMBERS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const leadership = useMemo(() => members.filter((item) => item.isLeadership), [members]);
  const board = useMemo(() => members.filter((item) => item.isBoardMember), [members]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Our Team</h1>
      </section>

      <section className="mt-16">
        <SectionHeading title="Association Leadership" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? [1, 2, 3, 4].map((x) => <Skeleton key={x} variant="card" className="h-80" />) : leadership.map((member) => <TeamCard key={member.id} member={member} />)}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading title="Board of Directors" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? [1, 2, 3, 4, 5, 6].map((x) => <Skeleton key={x} variant="card" className="h-80" />) : board.map((member) => <TeamCard key={member.id} member={member} />)}
        </div>
      </section>
    </motion.div>
  );
};

export default Team;
