import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

const GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', // Indigo-Violet
  'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)', // Sky-Cyan
  'linear-gradient(135deg, #059669 0%, #10b981 100%)', // Emerald
  'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', // Amber
  'linear-gradient(135deg, #475569 0%, #64748b 100%)', // Slate
  'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)', // Purple-Fuchsia
];

/**
 * Returns deterministic gradient based on string input
 */
export const getAvatarGradient = (seed = '') => {
  if (!seed) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

/**
 * Derives 1 or 2 letter initials from a full name (e.g. "Alex Chen" -> "AC")
 */
export const getInitials = (name = '') => {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) {
    const single = parts[0].replace(/[^a-zA-Z0-9]/g, '');
    return single.substring(0, Math.min(2, single.length)).toUpperCase();
  }
  const first = parts[0].replace(/[^a-zA-Z0-9]/g, '')[0] || '';
  const last = parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, '')[0] || '';
  return (first + last).toUpperCase();
};

/**
 * The prefix used in the database to identify a built-in preset.
 * Value stored in avatar_url: "preset:<id>"  (e.g. "preset:indigo-cube")
 * This is intentionally short (<= 30 chars) to fit within VARCHAR(500).
 */
export const PRESET_PREFIX = 'preset:';

/**
 * Neutral Avatar Presets — defined entirely in JS/SVG so no network request is needed.
 * Each entry has:
 *   id      — the stable identifier stored after "preset:" in the database
 *   label   — human-readable name shown in the picker
 *   svgContent — raw SVG markup used for rendering (never stored in the DB)
 *
 * The database stores only "preset:<id>" (e.g. "preset:indigo-cube").
 * The frontend resolves this identifier back to svgContent at render time.
 */
export const NEUTRAL_AVATAR_PRESETS = [
  {
    id: 'indigo-cube',
    label: 'Indigo Cube',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="#4338ca"/>
        <path d="M50 20 L80 37 L80 72 L50 89 L20 72 L20 37 Z" fill="#6366f1"/>
        <path d="M50 20 L80 37 L50 54 L20 37 Z" fill="#818cf8"/>
        <path d="M50 54 L80 37 L80 72 L50 89 Z" fill="#4f46e5"/>
      </svg>`
  },
  {
    id: 'cyan-orbit',
    label: 'Cyan Orbit',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="#0e7490"/>
        <circle cx="50" cy="50" r="32" fill="none" stroke="#22d3ee" stroke-width="5" opacity="0.6"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#67e8f9" stroke-width="6"/>
        <circle cx="50" cy="50" r="9" fill="#a5f3fc"/>
      </svg>`
  },
  {
    id: 'emerald-matrix',
    label: 'Emerald Matrix',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="#065f46"/>
        <circle cx="34" cy="34" r="9" fill="#34d399"/>
        <circle cx="66" cy="34" r="9" fill="#6ee7b7"/>
        <circle cx="34" cy="66" r="9" fill="#6ee7b7"/>
        <circle cx="66" cy="66" r="9" fill="#a7f3d0"/>
        <path d="M34 34 L66 34 L66 66 L34 66 Z" fill="none" stroke="#10b981" stroke-width="4"/>
      </svg>`
  },
  {
    id: 'amber-shield',
    label: 'Amber Shield',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="#b45309"/>
        <path d="M50 22 L76 34 C76 56 66 73 50 82 C34 73 24 56 24 34 Z" fill="#f59e0b"/>
        <circle cx="50" cy="48" r="12" fill="#fef3c7"/>
      </svg>`
  },
  {
    id: 'violet-spark',
    label: 'Violet Spark',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="#581c87"/>
        <path d="M50 18 Q50 50 82 50 Q50 50 50 82 Q50 50 18 50 Q50 50 50 18 Z" fill="#c084fc"/>
        <circle cx="50" cy="50" r="7" fill="#f3e8ff"/>
      </svg>`
  },
  {
    id: 'slate-compass',
    label: 'Slate Compass',
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="50" fill="#1e293b"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#64748b" stroke-width="4"/>
        <polygon points="50,26 57,47 50,44 43,47" fill="#94a3b8"/>
        <polygon points="50,74 57,53 50,56 43,53" fill="#cbd5e1"/>
      </svg>`
  }
];

/**
 * Build a lookup map from preset id -> svgContent for O(1) resolution.
 */
const PRESET_MAP = Object.fromEntries(
  NEUTRAL_AVATAR_PRESETS.map(p => [p.id, p.svgContent])
);

/**
 * Returns the DB-storable value for a preset: "preset:<id>"
 * Max length: 7 ("preset:") + longest id ("emerald-matrix" = 14) = 21 chars — well within VARCHAR(500).
 */
export const toPresetStorageValue = (presetId) => `${PRESET_PREFIX}${presetId}`;

/**
 * Resolves an avatarUrl (which may be null, empty, a "preset:<id>" token, or a real URL)
 * to a renderable source object:
 *   { type: 'image', src }    — render as <img src={src}>
 *   { type: 'svg', content }  — render as inline SVG (dangerouslySetInnerHTML)
 *   { type: 'initials' }      — render initials / silhouette fallback
 */
export const resolveAvatarSource = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return { type: 'initials' };
  }
  const trimmed = avatarUrl.trim();
  if (!trimmed) return { type: 'initials' };

  // Resolve preset identifier  (e.g. "preset:indigo-cube")
  if (trimmed.startsWith(PRESET_PREFIX)) {
    const id = trimmed.slice(PRESET_PREFIX.length);
    const svg = PRESET_MAP[id];
    if (svg) return { type: 'svg', content: svg };
    // Unknown preset id → fall back to initials
    return { type: 'initials' };
  }

  // Reject data URIs — they are far too large to be stored and should never
  // have been persisted in the first place. Treat them as no avatar.
  if (trimmed.startsWith('data:')) {
    return { type: 'initials' };
  }

  // Regular URL (http/https or relative)
  return { type: 'image', src: trimmed };
};

// ---------------------------------------------------------------------------
// Preset thumbnail shown in the picker. Uses dangerouslySetInnerHTML to render
// the inline SVG exactly — no network request, no img src data URI.
// ---------------------------------------------------------------------------
const PresetThumbnail = ({ svgContent, size }) => (
  <div
    style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}
    dangerouslySetInnerHTML={{ __html: svgContent }}
  />
);

// ---------------------------------------------------------------------------
// InlineSvgAvatar — renders a preset SVG as an inline element
// ---------------------------------------------------------------------------
const InlineSvgAvatar = ({ svgContent, altText, baseStyle, className }) => (
  <div
    className={className}
    style={{ ...baseStyle, overflow: 'hidden' }}
    aria-label={altText}
    role="img"
    data-testid="avatar-preset"
    dangerouslySetInnerHTML={{ __html: svgContent }}
  />
);

/**
 * Unified Avatar component.
 *
 * src — the raw value from the backend avatarUrl field. May be:
 *   - null / empty string      → show initials / silhouette
 *   - "preset:<id>"            → resolve locally to built-in SVG
 *   - "https://..."            → render as <img> with onError fallback
 *   - "data:..."               → ignored (treated as missing), never stored
 */
export const Avatar = ({
  src,
  name = '',
  alt,
  size = 32,
  shape = 'circle',
  className = '',
  style = {},
  border = true
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const numericSize = typeof size === 'number' ? size : parseInt(size, 10) || 32;
  const initials = getInitials(name || alt || '');
  const altText = alt || name || 'User avatar';
  const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '0.5rem' : '0';
  const fontSize = Math.max(10, Math.round(numericSize * 0.38));
  const iconSize = Math.max(12, Math.round(numericSize * 0.52));
  const gradient = getAvatarGradient(name || alt || 'user');

  const baseStyle = {
    width: `${numericSize}px`,
    height: `${numericSize}px`,
    minWidth: `${numericSize}px`,
    minHeight: `${numericSize}px`,
    borderRadius,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    userSelect: 'none',
    boxSizing: 'border-box',
    border: border ? '1px solid rgba(255, 255, 255, 0.18)' : 'none',
    ...style
  };

  const resolved = resolveAvatarSource(src);

  if (resolved.type === 'svg') {
    return (
      <InlineSvgAvatar
        svgContent={resolved.content}
        altText={altText}
        baseStyle={baseStyle}
        className={className}
      />
    );
  }

  if (resolved.type === 'image' && !imageError) {
    return (
      <img
        src={resolved.src}
        alt={altText}
        onError={() => setImageError(true)}
        className={className}
        style={{ ...baseStyle, objectFit: 'cover' }}
        data-testid="avatar-image"
      />
    );
  }

  // Initials / silhouette fallback
  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        background: gradient,
        color: '#ffffff',
        fontWeight: 600,
        fontSize: `${fontSize}px`,
        letterSpacing: '0.02em',
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)'
      }}
      aria-label={altText}
      role="img"
      data-testid="avatar-fallback"
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User size={iconSize} className="text-white opacity-90" aria-hidden="true" />
      )}
    </div>
  );
};

// Re-export PresetThumbnail for use in the picker
export { PresetThumbnail };

export default Avatar;
