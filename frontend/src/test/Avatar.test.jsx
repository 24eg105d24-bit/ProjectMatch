import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Avatar, {
  getInitials,
  getAvatarGradient,
  NEUTRAL_AVATAR_PRESETS,
  resolveAvatarSource,
  toPresetStorageValue,
  PRESET_PREFIX
} from '../components/common/Avatar';

// ---------------------------------------------------------------------------
// Unit tests for utility functions
// ---------------------------------------------------------------------------

describe('getInitials()', () => {
  it('derives two initials from a full name', () => {
    expect(getInitials('Alex Chen')).toBe('AC');
  });
  it('derives two chars from a single long word', () => {
    expect(getInitials('Alex')).toBe('AL');
  });
  it('derives one char from a single short word', () => {
    expect(getInitials('A')).toBe('A');
  });
  it('uses first and last word only for multi-word names', () => {
    expect(getInitials('John Ronald Reuel Tolkien')).toBe('JT');
  });
  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials(null)).toBe('');
  });
});

describe('getAvatarGradient()', () => {
  it('is deterministic for the same seed', () => {
    const grad1 = getAvatarGradient('Alex Chen');
    const grad2 = getAvatarGradient('Alex Chen');
    expect(grad1).toBe(grad2);
  });
  it('returns a CSS gradient string', () => {
    expect(getAvatarGradient('test')).toContain('linear-gradient');
  });
});

describe('NEUTRAL_AVATAR_PRESETS', () => {
  it('exports an array with at least 4 entries', () => {
    expect(Array.isArray(NEUTRAL_AVATAR_PRESETS)).toBe(true);
    expect(NEUTRAL_AVATAR_PRESETS.length).toBeGreaterThanOrEqual(4);
  });
  it('every preset has id, label, and svgContent (NOT a data URI url)', () => {
    NEUTRAL_AVATAR_PRESETS.forEach(preset => {
      expect(preset.id).toBeDefined();
      expect(preset.label).toBeDefined();
      expect(preset.svgContent).toBeDefined();
      // svgContent must be raw SVG, not a data URI
      expect(preset.svgContent).toMatch(/<svg/);
      expect(preset.svgContent).not.toMatch(/^data:/);
      // No "url" field with a data URI should exist
      expect(preset.url).toBeUndefined();
    });
  });
  it('every preset id produces a storage value <= 30 chars', () => {
    NEUTRAL_AVATAR_PRESETS.forEach(preset => {
      const value = toPresetStorageValue(preset.id);
      expect(value).toBe(`${PRESET_PREFIX}${preset.id}`);
      expect(value.length).toBeLessThanOrEqual(30);
    });
  });
});

describe('resolveAvatarSource()', () => {
  it('returns { type: "initials" } for null', () => {
    expect(resolveAvatarSource(null)).toEqual({ type: 'initials' });
  });
  it('returns { type: "initials" } for empty string', () => {
    expect(resolveAvatarSource('')).toEqual({ type: 'initials' });
  });
  it('returns { type: "initials" } for whitespace', () => {
    expect(resolveAvatarSource('   ')).toEqual({ type: 'initials' });
  });
  it('returns { type: "initials" } for a data URI (rejects it)', () => {
    const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg/>');
    expect(resolveAvatarSource(dataUri)).toEqual({ type: 'initials' });
  });
  it('returns { type: "svg", content } for a known preset identifier', () => {
    const result = resolveAvatarSource('preset:indigo-cube');
    expect(result.type).toBe('svg');
    expect(result.content).toMatch(/<svg/);
  });
  it('returns { type: "initials" } for an unknown preset identifier', () => {
    expect(resolveAvatarSource('preset:does-not-exist')).toEqual({ type: 'initials' });
  });
  it('returns { type: "image", src } for a normal https URL', () => {
    const url = 'https://example.com/photo.jpg';
    expect(resolveAvatarSource(url)).toEqual({ type: 'image', src: url });
  });
  it('resolves all built-in preset storage values to svg type', () => {
    NEUTRAL_AVATAR_PRESETS.forEach(preset => {
      const storageValue = toPresetStorageValue(preset.id);
      const result = resolveAvatarSource(storageValue);
      expect(result.type).toBe('svg');
      expect(result.content).toMatch(/<svg/);
    });
  });
});

// ---------------------------------------------------------------------------
// Component rendering tests
// ---------------------------------------------------------------------------

describe('Avatar Component', () => {
  it('renders image when valid https src is provided', () => {
    render(
      <Avatar
        src="https://example.com/avatar.png"
        name="Alex Chen"
        size={40}
      />
    );
    const img = screen.getByTestId('avatar-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    expect(img).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('renders initials fallback when no src', () => {
    render(<Avatar name="Alex Chen" size={40} />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AC');
  });

  it('renders initials when src is empty string', () => {
    render(<Avatar src="" name="Sarah Connor" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('SC');
  });

  it('renders initials when src is a data URI (rejects data URIs)', () => {
    const dataUri = 'data:image/png;base64,abc123==';
    render(<Avatar src={dataUri} name="Jordan Lee" />);
    // Should NOT render an img — data URI is rejected
    expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JL');
  });

  it('falls back to initials when image onError fires', () => {
    render(
      <Avatar
        src="https://example.com/broken.png"
        name="Taylor Swift"
      />
    );
    const img = screen.getByTestId('avatar-image');
    fireEvent.error(img);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('TS');
  });

  it('renders inline SVG for a preset storage identifier', () => {
    render(<Avatar src="preset:indigo-cube" name="Alice" size={40} />);
    // Should render as preset, not as img
    expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
    expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
    expect(screen.getByTestId('avatar-preset')).toBeInTheDocument();
  });

  it('renders inline SVG for ALL built-in presets', () => {
    NEUTRAL_AVATAR_PRESETS.forEach(preset => {
      const { unmount } = render(
        <Avatar src={toPresetStorageValue(preset.id)} name="User" />
      );
      expect(screen.getByTestId('avatar-preset')).toBeInTheDocument();
      unmount();
    });
  });

  it('falls back to initials for unknown preset identifier', () => {
    render(<Avatar src="preset:does-not-exist" name="Bob" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('BO');
  });

  it('renders silhouette icon when no name or src', () => {
    render(<Avatar src="" name="" />);
    const fallback = screen.getByTestId('avatar-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback.textContent).toBe('');
  });

  it('respects shape prop (circle vs rounded)', () => {
    const { rerender } = render(<Avatar name="Alex" shape="circle" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveStyle({ borderRadius: '50%' });
    rerender(<Avatar name="Alex" shape="rounded" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveStyle({ borderRadius: '0.5rem' });
  });
});
