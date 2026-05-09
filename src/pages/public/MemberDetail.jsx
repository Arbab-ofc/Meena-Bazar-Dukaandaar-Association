import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CalendarDays, Clock, Store, UserRound } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ImageKitImage from '@/components/ui/ImageKitImage';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { getMemberById } from '@/services/firestore/membersService';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatTimeRange = (openTime, closeTime) => {
  if (openTime && closeTime) return `${openTime} - ${closeTime}`;
  if (openTime) return `Opens ${openTime}`;
  if (closeTime) return `Closes ${closeTime}`;
  return 'Timings not set';
};

const MemberDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const stateShop = location.state?.shop || null;
  const [member, setMember] = useState(stateShop);
  const [loading, setLoading] = useState(!stateShop);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setError('');
        const data = await getMemberById(decodeURIComponent(id));
        if (isMounted && data) setMember(data);
        if (isMounted && !data && !stateShop) setMember(null);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load shop details.');
          if (!stateShop) setMember(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id, stateShop]);

  useEffect(() => {
    document.title = member?.shopName
      ? `${member.shopName} | Member Shop`
      : 'Member Shop | Meena Bazar Dukaandaar Association';
  }, [member?.shopName]);

  const schedule = member?.schedule || {};

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Skeleton variant="card" className="h-[520px]" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <EmptyState
          title="Shop not found"
          description={error || 'The requested member shop could not be located.'}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Members', href: '/members' },
          { label: member.shopName || 'Shop Detail' }
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.45fr)_420px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-sm md:rounded-[var(--radius-lg)] md:shadow-md xl:max-h-[620px]">
            <ImageKitImage
              src={member.shopImageUrl || member.ownerImageUrl}
              alt={member.shopName ? `${member.shopName} shop` : 'Member shop'}
              className="h-[320px] w-full rounded-none sm:h-[440px] lg:h-[560px] xl:h-[620px]"
              objectFit="contain"
              transformations={{ w: 1100, h: 680, q: 84, f: 'auto' }}
            />
          </div>

          {member.ownerImageUrl ? (
            <div className="mt-4 grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 rounded-[var(--radius)] border border-border bg-surface p-3 sm:mt-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-stretch sm:gap-5 sm:bg-transparent sm:p-0 sm:border-0">
              <ImageKitImage
                src={member.ownerImageUrl}
                alt={member.ownerName ? `${member.ownerName} owner` : 'Shop owner'}
                className="h-24 w-full sm:h-44"
                objectFit="contain"
                transformations={{ w: 360, h: 360, q: 82, f: 'auto' }}
              />
              <div className="flex min-w-0 flex-col justify-center sm:rounded-[var(--radius)] sm:border sm:border-border sm:bg-surface sm:p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-gold-muted">Owner</p>
                <p className="mt-1 truncate font-heading text-2xl leading-tight text-text sm:mt-2 sm:text-3xl">{member.ownerName || 'Owner not listed'}</p>
                <p className="mt-1 text-xs text-text-muted sm:mt-2 sm:text-sm">Registered member of Meena Bazar Dukaandaar Association.</p>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="rounded-[var(--radius)] border border-border bg-bg-elevated p-4 shadow-sm md:rounded-[var(--radius-lg)] md:p-6 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">Shop {member.shopNumber || 'N/A'}</Badge>
            <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status || 'Status not set'}</Badge>
          </div>

          <h1 className="mt-4 font-heading text-3xl leading-tight text-text md:mt-5 md:text-5xl">
            {member.shopName || 'Unnamed Shop'}
          </h1>

          <div className="mt-5 grid gap-3 md:mt-7 md:gap-4 xl:grid-cols-1">
            <div className="flex gap-3 rounded-[var(--radius)] border border-border bg-surface p-3 md:p-4">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-text-subtle">Shop Number</p>
                <p className="mt-1 text-sm font-medium text-text">{member.shopNumber || 'Not listed'}</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-[var(--radius)] border border-border bg-surface p-3 md:p-4">
              <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-text-subtle">Owner Name</p>
                <p className="mt-1 text-sm font-medium text-text">{member.ownerName || 'Not listed'}</p>
              </div>
            </div>

            <div className="flex gap-3 rounded-[var(--radius)] border border-border bg-surface p-3 md:p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-text-subtle">Shop Timings</p>
                <p className="mt-1 text-sm font-medium text-text">{formatTimeRange(member.openTime, member.closeTime)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[var(--radius)] border border-border bg-surface p-3 md:mt-6 md:p-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gold" />
              <p className="text-sm font-medium text-text">Weekly Schedule</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
              {WEEK_DAYS.map((day) => {
                const isOpen = Boolean(schedule[day]);
                return (
                  <div
                    key={day}
                    className={`rounded-[var(--radius-sm)] border px-3 py-2 text-xs ${
                      isOpen
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                        : 'border-border bg-bg text-text-muted'
                    }`}
                  >
                    <span className="font-medium">{day}</span>
                    <span className="ml-1">{isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {isAdmin ? (
            <div className="mt-6">
              <Link to="/members">
                <Button variant="secondary" className="w-full">Back to Member Directory</Button>
              </Link>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
};

export default MemberDetail;
