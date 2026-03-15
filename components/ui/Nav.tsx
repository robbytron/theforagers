'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  MapPin,
  CalendarDays,
  Waves,
  Sprout,
  UtensilsCrossed,
  BookOpen,
  ScrollText,
  Compass,
  AlertTriangle,
  Shield,
  Scale,
  Sun,
  Mountain,
  Trees,
  ChefHat,
  Users,
  Mail,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import styles from './Nav.module.css';

type DropdownItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

type NavSection = {
  label: string;
  href?: string;
  items: DropdownItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Explore',
    items: [
      { label: 'Species', href: '/species', icon: <Leaf size={18} />, description: 'Browse edible species' },
      { label: 'Where to Forage', href: '/where-to-forage', icon: <MapPin size={18} />, description: 'Find foraging locations' },
      { label: 'Calendar', href: '/calendar', icon: <CalendarDays size={18} />, description: 'Seasonal availability' },
      { label: 'Coastal', href: '/coastal', icon: <Waves size={18} />, description: 'Sea & shore foraging' },
      { label: 'Beginners', href: '/beginners', icon: <Sprout size={18} />, description: 'Start your journey' },
    ],
  },
  {
    label: 'Learn',
    items: [
      { label: 'Recipes', href: '/recipes', icon: <UtensilsCrossed size={18} />, description: 'Cook with wild food' },
      { label: 'Guides', href: '/guides', icon: <BookOpen size={18} />, description: 'In-depth guides' },
      { label: 'Prepare & Preserve', href: '/prepare-and-preserve', icon: <ChefHat size={18} />, description: 'Preserving techniques' },
      { label: 'Field Guides & Kit', href: '/field-guides-and-kit', icon: <Compass size={18} />, description: 'Recommended gear' },
    ],
  },
  {
    label: 'Safety',
    items: [
      { label: 'Dangers', href: '/dangers', icon: <AlertTriangle size={18} />, description: 'Toxic species' },
      { label: 'Safety Guide', href: '/safety', icon: <Shield size={18} />, description: 'Forage safely' },
      { label: 'Legal', href: '/legal', icon: <Scale size={18} />, description: 'UK foraging law' },
      { label: 'The Code', href: '/foragers-code', icon: <ScrollText size={18} />, description: 'Ethical foraging' },
    ],
  },
  {
    label: 'Journal',
    href: '/journal',
    items: [
      { label: 'In Season', href: '/journal/in-season', icon: <Sun size={18} />, description: 'What\'s ready now' },
      { label: 'From The Field', href: '/journal/the-field', icon: <Mountain size={18} />, description: 'Foraging stories' },
      { label: 'The Land', href: '/journal/the-land', icon: <Trees size={18} />, description: 'Landscape essays' },
      { label: 'The Wild Table', href: '/journal/wild-table', icon: <ChefHat size={18} />, description: 'Cooking notes' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'About Us', href: '/about', icon: <Users size={18} />, description: 'Our story' },
      { label: 'Newsletter', href: '/newsletter', icon: <Mail size={18} />, description: 'Stay updated' },
    ],
  },
];

export default function Nav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>The Foragers</Link>

      {/* Desktop Navigation */}
      <ul className={styles.links}>
        {NAV_SECTIONS.map((section) => (
          <li
            key={section.label}
            className={styles.dropdownContainer}
            onMouseEnter={() => setActiveDropdown(section.label)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {section.href ? (
              <Link href={section.href} className={styles.dropdownTrigger}>
                {section.label}
                <ChevronDown size={14} className={`${styles.chevron} ${activeDropdown === section.label ? styles.chevronOpen : ''}`} />
              </Link>
            ) : (
              <button className={styles.dropdownTrigger}>
                {section.label}
                <ChevronDown size={14} className={`${styles.chevron} ${activeDropdown === section.label ? styles.chevronOpen : ''}`} />
              </button>
            )}

            {activeDropdown === section.label && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownInner}>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.dropdownItem}
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span className={styles.dropdownIcon}>{item.icon}</span>
                      <div className={styles.dropdownText}>
                        <span className={styles.dropdownLabel}>{item.label}</span>
                        {item.description && (
                          <span className={styles.dropdownDesc}>{item.description}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuInner}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className={styles.mobileSection}>
                {section.href ? (
                  <Link href={section.href} className={styles.mobileSectionTitle} onClick={() => setMobileMenuOpen(false)}>
                    {section.label}
                  </Link>
                ) : (
                  <h3 className={styles.mobileSectionTitle}>{section.label}</h3>
                )}
                <ul className={styles.mobileSectionList}>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={styles.mobileLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={styles.mobileLinkIcon}>{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
