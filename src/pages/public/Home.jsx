import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Scale, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import NoticeCard from '@/components/common/NoticeCard';
import TeamCard from '@/components/common/TeamCard';
import GalleryCard from '@/components/common/GalleryCard';
import ShopCarousel from '@/components/common/ShopCarousel';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ImageKitImage from '@/components/ui/ImageKitImage';
import { getPublishedNotices } from '@/services/firestore/noticesService';
import { getTeamMembers } from '@/services/firestore/teamService';
import { getGalleryItems } from '@/services/firestore/galleryService';
import { getMembers } from '@/services/firestore/membersService';
import { SEED_TEAM_MEMBERS } from '@/data/seedData';
import { useTheme } from '@/hooks/useTheme';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatDate } from '@/utils/formatDate';

const HeroBackground = lazy(() => import('@/components/three/HeroBackground'));

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const highlightItems = [
  {
    title: 'Legal Recognition',
    icon: Scale,
    description:
      'Fully registered with documented legal standing, PAN registration, and official records.'
  },
  {
    title: 'Collective Strength',
    icon: Users,
    description:
      'Merchants and shop owners united under one structured association representing Meena Bazar.'
  },
  {
    title: 'Legal Protection',
    icon: Shield,
    description:
      'Active in courts and commissions to protect the rights and interests of our members.'
  },
  {
    title: 'Transparent Records',
    icon: FileText,
    description:
      'All documents, notices, orders, and records publicly accessible for accountability.'
  }
];

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [memberShops, setMemberShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(-1);
  const [teamSlideIndex, setTeamSlideIndex] = useState(0);
  const [isTeamPaused, setTeamPaused] = useState(false);
  const [gallerySlideIndex, setGallerySlideIndex] = useState(0);
  const [isGalleryPaused, setGalleryPaused] = useState(false);
  const [canLoadHeroBackground, setCanLoadHeroBackground] = useState(false);
  const { resolvedTheme } = useTheme();
  const shouldRenderHeroBackground = useMediaQuery('(min-width: 768px)');
  const leadershipItems = team.slice(0, 4);
  const activeMemberShops = memberShops
    .filter((shop) => String(shop.status || '').toLowerCase() === 'active')
    .slice(0, 12);
  const galleryItems = gallery.slice(0, 6);
  const activeGalleryItem = activeGalleryIndex >= 0 ? galleryItems[activeGalleryIndex] : null;

  useEffect(() => {
    document.title = 'Meena Bazar Dukaandaar Association | Patna Market, Bihar';
  }, []);

  useEffect(() => {
    if (!shouldRenderHeroBackground) {
      setCanLoadHeroBackground(false);
      return undefined;
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setCanLoadHeroBackground(true), { timeout: 1800 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(() => setCanLoadHeroBackground(true), 800);
    return () => window.clearTimeout(timeoutId);
  }, [shouldRenderHeroBackground]);

  useEffect(() => {
    const load = async () => {
      const [noticeResult, teamResult, galleryResult, memberResult] = await Promise.allSettled([
        getPublishedNotices(3),
        getTeamMembers(),
        getGalleryItems(),
        getMembers()
      ]);

      setNotices(noticeResult.status === 'fulfilled' ? noticeResult.value : []);

      if (teamResult.status === 'fulfilled') {
        setTeam(teamResult.value.length ? teamResult.value : SEED_TEAM_MEMBERS);
      } else {
        setTeam(SEED_TEAM_MEMBERS);
      }

      setGallery(galleryResult.status === 'fulfilled' ? galleryResult.value.slice(0, 6) : []);
      setMemberShops(memberResult.status === 'fulfilled' ? memberResult.value : []);
      setLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    if (galleryItems.length < 2 || isGalleryPaused) return undefined;

    const intervalId = window.setInterval(() => {
      setGallerySlideIndex((index) => (index + 1) % galleryItems.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [galleryItems.length, isGalleryPaused]);

  useEffect(() => {
    if (gallerySlideIndex >= galleryItems.length) setGallerySlideIndex(0);
  }, [galleryItems.length, gallerySlideIndex]);

  useEffect(() => {
    if (leadershipItems.length < 2 || isTeamPaused) return undefined;

    const intervalId = window.setInterval(() => {
      setTeamSlideIndex((index) => (index + 1) % leadershipItems.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isTeamPaused, leadershipItems.length]);

  useEffect(() => {
    if (teamSlideIndex >= leadershipItems.length) setTeamSlideIndex(0);
  }, [leadershipItems.length, teamSlideIndex]);

  const highlightsRef = useRef(null);
  const highlightsInView = useInView(highlightsRef, { once: true, margin: '-100px' });
  const heroOverlayClass =
    resolvedTheme === 'dark'
      ? 'from-bg/5 via-bg/20 to-bg/55'
      : 'from-bg/30 via-bg/65 to-bg';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden px-4 py-8 md:min-h-screen md:px-6 md:py-20">
        {shouldRenderHeroBackground && canLoadHeroBackground ? (
          <Suspense fallback={null}>
            <HeroBackground />
          </Suspense>
        ) : null}
        <div className={`absolute inset-0 bg-gradient-to-b ${heroOverlayClass}`} />
        <motion.div className="relative z-10 mx-auto max-w-4xl text-center" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1 variants={fadeInUp} className="mt-4 font-heading text-4xl leading-tight text-text sm:text-5xl md:text-7xl">
            Patna Market Dukaandaar Association
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-4 font-heading text-2xl italic text-text sm:text-3xl md:text-4xl">
            Unity is Strength
          </motion.p>
          <motion.p variants={fadeInUp} className="mt-2 font-heading text-2xl italic text-gold">
            एकता में शक्ति
          </motion.p>
          <motion.div variants={fadeInUp} className="mx-auto mt-6 h-px w-16 bg-gold" />
          <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-2xl text-balance text-base text-text sm:mt-6 sm:text-lg">
            Representing the collective interests, legal rights, and commercial welfare of the merchants of Meena Bazar, Patna — with integrity, documentation, and unity.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
            <Link to="/notices"><Button>View Notices</Button></Link>
            <Link to="/contact"><Button variant="secondary">Contact Us</Button></Link>
          </motion.div>
        </motion.div>
      </section>

      <section ref={highlightsRef} className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading
          centered
          label="Mission"
          title="Why We Stand Together"
          subtitle="The pillars of our association's mission and identity"
        />
        <motion.div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4" variants={staggerContainer} initial="hidden" animate={highlightsInView ? 'visible' : 'hidden'}>
          {highlightItems.map((item) => (
            <motion.article key={item.title} variants={fadeInUp} whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }} className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm transition">
              <item.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-heading text-2xl text-text">{item.title}</h3>
              <p className="mt-3 text-sm text-text-muted">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading
          label="Communications"
          title="Latest Notices"
          subtitle="Official communications from the association"
        />
        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">{[1, 2, 3].map((id) => <Skeleton key={id} variant="card" className="h-56" />)}</div>
        ) : notices.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">{notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}</div>
        ) : (
          <div className="mt-10"><EmptyState title="No notices published" description="Official notices will appear here as soon as they are published." /></div>
        )}
        <div className="mt-8"><Link to="/notices"><Button variant="secondary">View All Notices</Button></Link></div>
      </section>

      <section className="bg-surface px-4 py-20 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="mb-6 h-12 w-1 bg-gold" />
            <h2 className="font-heading text-4xl text-text">Our Legal Standing</h2>
            <p className="mt-4 text-text-muted">
              Meena Bazar Dukaandaar Association is a duly registered association with documented legal identity. We have engaged with courts including the Patna High Court (LPA 486/2021), State Consumer Disputes Redressal Commission, and regulatory bodies to protect member rights.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>Registration status: Valid and recognized</li>
              <li>PAN status: Active institutional PAN</li>
              <li>Case references: LPA 486/2021 and related proceedings</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-8 shadow-md">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">Legal Desk</p>
            <h3 className="mt-3 font-heading text-3xl text-text">Track Case Progress and Filings</h3>
            <p className="mt-4 text-sm text-text-muted">Explore case summaries, status updates, and linked legal records in one structured legal archive.</p>
            <div className="mt-6"><Link to="/legal-updates"><Button>View Legal Updates</Button></Link></div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading label="About" title="A Historic Market, A Unified Voice" />
            <p className="mt-5 text-text-muted">
              Meena Bazar is a historic commercial center of Patna. The association safeguards legal rights, manages collective issues, and supports members through structured documentation and representation. It serves as a trusted institutional voice for local merchants.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-md">
            <div className="h-1 w-full bg-gradient-to-r from-gold-muted via-gold to-gold-muted" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12">
              <div className="border-b border-border p-6 text-center sm:border-b-0 sm:border-r lg:col-span-3 lg:flex lg:flex-col lg:justify-center">
                <p className="font-heading text-4xl leading-none text-gold lg:text-5xl">1986</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-text-muted">Est. Year</p>
                <p className="mt-2 text-xs text-text-subtle">Foundation of formal representation</p>
              </div>

              <div className="border-b border-border bg-bg-elevated p-6 text-center sm:border-b-0 sm:border-r lg:col-span-6 lg:px-10 lg:py-8">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-muted">Association Strength</p>
                <p className="mt-3 font-heading text-6xl leading-none text-gold lg:text-7xl">300+</p>
                <p className="mt-3 text-sm uppercase tracking-[0.14em] text-text-muted">Active Members</p>
                <p className="mx-auto mt-3 max-w-sm text-xs text-text-subtle">
                  A coordinated merchant network across Meena Bazar with shared legal and administrative support.
                </p>
              </div>

              <div className="p-6 text-center lg:col-span-3 lg:flex lg:flex-col lg:justify-center">
                <p className="font-heading text-4xl leading-none text-gold lg:text-5xl">20+</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-text-muted">Legal Matters</p>
                <p className="mt-2 text-xs text-text-subtle">Cases and proceedings supported</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8"><Link to="/about"><Button variant="secondary">Learn More</Button></Link></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading title="Our Leadership" subtitle="Representing the association with accountability and service." />
        {leadershipItems.length ? (
          <>
            <div
              className="mt-10 sm:hidden"
              onMouseEnter={() => setTeamPaused(true)}
              onMouseLeave={() => setTeamPaused(false)}
              onFocus={() => setTeamPaused(true)}
              onBlur={() => setTeamPaused(false)}
            >
              <div className="overflow-hidden">
                <motion.div
                  key={leadershipItems[teamSlideIndex]?.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TeamCard member={leadershipItems[teamSlideIndex]} />
                </motion.div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Previous leader"
                  className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-surface transition hover:bg-surface-2"
                  onClick={() => setTeamSlideIndex((index) => (index - 1 + leadershipItems.length) % leadershipItems.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-2">
                  {leadershipItems.map((member, index) => (
                    <button
                      key={member.id}
                      type="button"
                      aria-label={`Show leader ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${teamSlideIndex === index ? 'w-6 bg-gold' : 'w-2.5 bg-border-strong'}`}
                      onClick={() => setTeamSlideIndex(index)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next leader"
                  className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-surface transition hover:bg-surface-2"
                  onClick={() => setTeamSlideIndex((index) => (index + 1) % leadershipItems.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">{leadershipItems.map((member) => <TeamCard key={member.id} member={member} />)}</div>
          </>
        ) : null}
        <div className="mt-8"><Link to="/team"><Button variant="secondary">Meet the Full Team</Button></Link></div>
      </section>

      <section className="bg-surface px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              label="Member Shops"
              title="Shops of Meena Bazar"
              subtitle="A rotating look at active member shops listed by the association."
            />
            <Link to="/members" className="shrink-0">
              <Button variant="secondary">View All Shops</Button>
            </Link>
          </div>
          <ShopCarousel shops={activeMemberShops} loading={loading} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading title="Association in Action" subtitle="Recent moments from meetings, events, and public engagements." />
        {gallery.length ? (
          <>
            <div
              className="mt-10 md:hidden"
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
              onFocus={() => setGalleryPaused(true)}
              onBlur={() => setGalleryPaused(false)}
            >
              <div className="overflow-hidden">
                <motion.div
                  key={galleryItems[gallerySlideIndex]?.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GalleryCard item={galleryItems[gallerySlideIndex]} onClick={() => setActiveGalleryIndex(gallerySlideIndex)} />
                </motion.div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-label="Previous gallery item"
                  className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-surface transition hover:bg-surface-2"
                  onClick={() => setGallerySlideIndex((index) => (index - 1 + galleryItems.length) % galleryItems.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-2">
                  {galleryItems.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Show gallery item ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all ${gallerySlideIndex === index ? 'w-6 bg-gold' : 'w-2.5 bg-border-strong'}`}
                      onClick={() => setGallerySlideIndex(index)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next gallery item"
                  className="inline-flex h-10 w-10 items-center justify-center rounded border border-border bg-surface transition hover:bg-surface-2"
                  onClick={() => setGallerySlideIndex((index) => (index + 1) % galleryItems.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-10 hidden auto-rows-[220px] grid-cols-4 gap-4 md:grid">
              {galleryItems.map((item, index) => (
                <div key={item.id} className={index === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
                  <GalleryCard item={item} onClick={() => setActiveGalleryIndex(index)} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="Gallery updates coming soon"
              description="Recent moments from meetings, events, and public engagements will be added shortly."
            />
          </div>
        )}
        <div className="mt-8"><Link to="/gallery"><Button variant="secondary">View Full Gallery</Button></Link></div>
      </section>

      <Modal isOpen={Boolean(activeGalleryItem)} onClose={() => setActiveGalleryIndex(-1)} title={activeGalleryItem?.title || 'Gallery'} size="lg">
        {activeGalleryItem ? (
          <div>
            <ImageKitImage
              src={activeGalleryItem.imageUrl}
              alt={activeGalleryItem.title}
              className="h-[60vh] w-full bg-surface"
              objectFit="contain"
              transformations={{ q: 85, f: 'auto' }}
            />
            <div className="mt-4">
              <p className="font-heading text-2xl text-text">{activeGalleryItem.title}</p>
              <p className="text-sm text-text-muted">{formatDate(activeGalleryItem.eventDate)} | {activeGalleryItem.location}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      <section className="relative overflow-hidden bg-surface-2 px-4 py-20 md:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl rounded-[var(--radius-lg)] border border-border/80 bg-gradient-to-br from-bg-elevated via-bg-elevated to-surface p-7 shadow-lg md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Contact & Support
            </p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-text md:text-5xl">Get In Touch</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-text-muted md:text-lg">
              Have a query, complaint, or want to connect with the association? We usually respond quickly.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/contact">
                <Button className="min-w-[190px]">Send a Message</Button>
              </Link>
              <Link to="/documents">
                <Button variant="secondary" className="min-w-[190px] border-border-strong bg-bg-elevated">
                  View Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
