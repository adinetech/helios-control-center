import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useEffect, useRef } from 'react';
import {
  Sun, BarChart3, Shield, Globe, Zap, Server,
  ChevronRight, ArrowRight, CheckCircle, Activity,
  Battery, TrendingUp, Bell, Users, Cloud
} from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Live SCADA dashboards with telemetry from every inverter. Solar PV, battery SOC, grid import/export — all in one view.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    desc: 'Granular permission tiers for Admins, Operators, and Viewers. Secure JWT authentication with audit trails.',
    color: '#6366f1',
  },
  {
    icon: Globe,
    title: 'Multi-Site Management',
    desc: 'Manage dozens of geographically distributed solar farms from a single pane of glass with instant drill-down.',
    color: '#10b981',
  },
  {
    icon: Bell,
    title: 'Proactive Alerting',
    desc: 'Configurable threshold alerts for inverter faults, battery anomalies, and grid events delivered in real-time.',
    color: '#ef4444',
  },
  {
    icon: Activity,
    title: 'Full Observability Stack',
    desc: 'Prometheus metrics, Loki log aggregation, and Grafana dashboards — enterprise-grade monitoring out of the box.',
    color: '#06b6d4',
  },
  {
    icon: Cloud,
    title: 'Cloud-Native Architecture',
    desc: 'Docker Compose orchestration on AWS EC2 with Tailscale-secured private networking and GitHub Actions CI/CD.',
    color: '#8b5cf6',
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    sites: 'Up to 3 Sites',
    compute: 't3.small (2 vCPU, 2GB)',
    storage: '30 GB SSD',
    bandwidth: '100 GB/month',
    monitoring: 'Basic Prometheus + Grafana',
    backup: '7-day retention',
    price: '$28',
    period: '/month',
    color: '#6366f1',
    highlight: false,
  },
  {
    name: 'Professional',
    sites: 'Up to 20 Sites',
    compute: 't3.medium (2 vCPU, 4GB)',
    storage: '100 GB SSD',
    bandwidth: '500 GB/month',
    monitoring: 'Full Observability Stack',
    backup: '30-day retention + snapshots',
    price: '$72',
    period: '/month',
    color: '#f59e0b',
    highlight: true,
  },
  {
    name: 'Enterprise',
    sites: 'Unlimited Sites',
    compute: 't3.xlarge (4 vCPU, 16GB)',
    storage: '500 GB SSD + S3 Backup',
    bandwidth: 'Unlimited',
    monitoring: 'Multi-region + SLA dashboards',
    backup: '90-day + Disaster Recovery',
    price: '$240',
    period: '/month',
    color: '#10b981',
    highlight: false,
  },
];

const STATS = [
  { value: '99.9%', label: 'Platform Uptime SLA' },
  { value: '< 5s', label: 'Telemetry Latency' },
  { value: '∞', label: 'Data Points Stored' },
  { value: '256-bit', label: 'Encryption Standard' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const heroRef = useRef<HTMLDivElement>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#030712', color: '#f9fafb', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(3,7,18,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sun size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            SolarOps
          </span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.3)', fontWeight: 600 }}>
            CLOUD
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Features</a>
          <a href="#pricing" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Pricing</a>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              border: 'none', borderRadius: 8, padding: '8px 20px',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Launch Platform <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 6rem', position: 'relative', overflow: 'hidden' }}>
        {/* Glowing orbs */}
        <div ref={heroRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '30%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 900 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }} />
            Enterprise Solar Operations Platform
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            Manage Your{' '}
            <span style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Solar Empire
            </span>
            {' '}From One Platform
          </h1>

          {/* Sub */}
          <p style={{ fontSize: '1.2rem', color: '#9ca3af', maxWidth: 680, margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 400 }}>
            SolarOps is a centralized cloud platform for solar farm operators — real-time SCADA dashboards, predictive analytics, multi-site management, and enterprise observability. All in one place.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                border: 'none', borderRadius: 12, padding: '14px 32px',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 0 40px rgba(245,158,11,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.transform = 'translateY(-2px)'; (e.target as HTMLElement).closest('button')!.style.boxShadow = '0 0 60px rgba(245,158,11,0.5)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.transform = 'translateY(0)'; (e.target as HTMLElement).closest('button')!.style.boxShadow = '0 0 40px rgba(245,158,11,0.3)'; }}
            >
              <Zap size={18} /> Open Operations Center
            </button>
            <a href="#features" style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '14px 32px', color: '#f9fafb', fontWeight: 600,
              cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center',
              gap: 8, textDecoration: 'none',
            }}>
              See Features <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────── */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {STATS.map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────── */}
      <section id="features" style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', marginBottom: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Platform Capabilities</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Everything you need to run<br />a solar operation</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
              Built for solar operators who need more than spreadsheets. A complete operational platform from day one.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '2rem', transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = f.color + '50'; (e.currentTarget as HTMLElement).style.background = f.color + '08'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ─────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginBottom: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Cloud Architecture</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>Built on production-grade infrastructure</h2>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem' }}>
              Deployed on AWS EC2 with Docker Compose orchestration. Tailscale private networking ensures zero-exposure access control. GitHub Actions handles zero-downtime continuous delivery.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['AWS EC2 with Elastic IP', 'Docker & Docker Compose', 'Tailscale VPN (Zero-trust networking)', 'PostgreSQL with automated backups', 'Prometheus + Loki + Grafana observability', 'GitHub Actions CI/CD pipeline'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: '#d1d5db' }}>
                  <CheckCircle size={16} color="#10b981" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { icon: Server, label: 'Backend', sub: 'NestJS + REST', color: '#6366f1' },
              { icon: BarChart3, label: 'Frontend', sub: 'React + Recharts', color: '#f59e0b' },
              { icon: Activity, label: 'Metrics', sub: 'Prometheus', color: '#ef4444' },
              { icon: Battery, label: 'Telemetry', sub: 'Deye Inverter', color: '#10b981' },
              { icon: Shield, label: 'Auth', sub: 'JWT + RBAC', color: '#8b5cf6' },
              { icon: TrendingUp, label: 'Analytics', sub: 'Grafana', color: '#06b6d4' },
            ].map(t => (
              <div key={t.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <t.icon size={18} color={t.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.label}</div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────── */}
      <section id="pricing" style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginBottom: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Infrastructure Pricing</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Transparent cloud cost estimates</h2>
            <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>
              All tiers run on AWS with predictable monthly billing. Scale up as your solar portfolio grows.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            {PRICING_TIERS.map(tier => (
              <div key={tier.name} style={{
                background: tier.highlight ? `linear-gradient(160deg, ${tier.color}15, rgba(3,7,18,0.9))` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${tier.highlight ? tier.color + '60' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 20, padding: '2.5rem',
                transform: tier.highlight ? 'scale(1.03)' : 'scale(1)',
                boxShadow: tier.highlight ? `0 0 60px ${tier.color}20` : 'none',
              }}>
                {tier.highlight && (
                  <div style={{ background: tier.color, color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginBottom: '1rem', letterSpacing: '0.1em' }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem' }}>{tier.name}</h3>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{tier.sites}</div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: tier.color }}>{tier.price}</span>
                  <span style={{ color: '#6b7280' }}>{tier.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Compute', val: tier.compute },
                    { label: 'Storage', val: tier.storage },
                    { label: 'Bandwidth', val: tier.bandwidth },
                    { label: 'Monitoring', val: tier.monitoring },
                    { label: 'Backup', val: tier.backup },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', gap: 8 }}>
                      <span style={{ color: '#6b7280' }}>{row.label}</span>
                      <span style={{ color: '#d1d5db', textAlign: 'right', fontWeight: 500 }}>{row.val}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                    background: tier.highlight ? tier.color : 'rgba(255,255,255,0.08)',
                    color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  Get Started <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💡 Cost Optimization Recommendations</h4>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              Use AWS Reserved Instances (1-year) for <strong style={{ color: '#f9fafb' }}>up to 40% savings</strong> vs On-Demand. Enable S3 Intelligent-Tiering for telemetry archival. Use CloudWatch Savings Plans for monitoring cost reduction. Multi-region DR adds ~30% to base compute cost but ensures RPO &lt; 15min.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            Ready to take control<br />of your solar operations?
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: 500, margin: '0 auto 3rem' }}>
            Log into the Operations Center and start monitoring your solar farms in real-time.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              border: 'none', borderRadius: 14, padding: '18px 48px',
              color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 0 60px rgba(245,158,11,0.4)',
            }}
          >
            <Zap size={20} /> Open Operations Center
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem', textAlign: 'center', color: '#4b5563', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '0.5rem' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sun size={12} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: '#6b7280' }}>SolarOps Solar Farm Management Cloud</span>
        </div>
        <p>© {new Date().getFullYear()} SolarOps. Built for enterprise solar operations.</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
