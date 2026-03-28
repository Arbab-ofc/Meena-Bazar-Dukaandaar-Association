import { memo } from 'react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ImageKitImage from '@/components/ui/ImageKitImage';

const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

/** @param {{member: any}} props */
const TeamCard = ({ member }) => (
  <Card hover className="overflow-hidden p-5 text-center">
    {member.photoUrl ? (
      <ImageKitImage src={member.photoUrl} alt={member.name} className="mx-auto mb-4 h-44 w-36 rounded-[var(--radius)]" transformations={{ w: 300, h: 400, q: 80, f: 'auto' }} />
    ) : (
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-gold/40 bg-surface-2 font-heading text-3xl text-gold">
        {initials(member.name)}
      </div>
    )}
    <h3 className="font-heading text-2xl text-text">{member.name}</h3>
    <p className="mt-1 text-sm text-text-muted">{member.roleEn} / {member.roleHi}</p>
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {member.isLeadership ? <Badge variant="gold">Leadership</Badge> : null}
      {member.isBoardMember ? <Badge variant="accent">Board</Badge> : null}
    </div>
  </Card>
);

export default memo(TeamCard);
