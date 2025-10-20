# Accessibility Testing Checklist

Use this checklist for every major feature or PR to ensure accessibility compliance.

## Pre-Development

- [ ] Review WCAG 2.1 requirements for feature type
- [ ] Consider keyboard navigation in design
- [ ] Plan focus management for interactive elements
- [ ] Ensure designs meet color contrast requirements

## During Development

### Visual Design
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text 18pt+)
- [ ] Don't rely on color alone to convey information
- [ ] Touch targets ≥ 44x44px on mobile

### HTML Structure
- [ ] Use semantic HTML (`<header>`, `<main>`, `<nav>`, etc.)
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] All images have alt text (or `alt=""` for decorative)
- [ ] Form inputs have associated `<label>` elements

### Keyboard Navigation
- [ ] All functionality available via keyboard
- [ ] Focus order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps (except modals)
- [ ] ESC key closes modals/dialogs
- [ ] Tab/Shift+Tab navigates correctly

### ARIA & Semantics
- [ ] Use native HTML elements when possible
- [ ] ARIA labels for icon-only buttons
- [ ] `role="dialog"` and `aria-modal="true"` for modals
- [ ] `aria-live` regions for dynamic content
- [ ] `aria-expanded` for expandable elements
- [ ] `aria-describedby` for error messages

### Forms
- [ ] All inputs have labels
- [ ] Required fields indicated (visually and programmatically)
- [ ] Error messages associated with inputs (`aria-describedby`)
- [ ] Clear, helpful error messages
- [ ] `aria-invalid` on inputs with errors
- [ ] Submit buttons have descriptive text

### Modals & Dialogs
- [ ] Focus moves to modal on open
- [ ] Focus trapped within modal
- [ ] Focus restored on close
- [ ] ESC key closes modal
- [ ] Backdrop click closes modal (or explicitly disabled)
- [ ] `role="dialog"` attribute
- [ ] `aria-modal="true"` attribute
- [ ] `aria-labelledby` points to title

## Testing

### Automated Testing
- [ ] Run axe DevTools browser extension
- [ ] Run Lighthouse accessibility audit (score ≥ 90)
- [ ] Unit tests for keyboard interactions
- [ ] Unit tests for ARIA attributes

### Manual Testing - Keyboard
- [ ] Navigate entire page with Tab only
- [ ] Navigate backwards with Shift+Tab
- [ ] Activate buttons/links with Enter/Space
- [ ] Close modals with ESC
- [ ] No focus traps (except intentional in modals)

### Manual Testing - Screen Reader
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All content is announced
- [ ] Interactive elements have clear labels
- [ ] Form errors are announced
- [ ] Dynamic content updates announced
- [ ] Images have appropriate alt text

### Manual Testing - Visual
- [ ] Test at 200% browser zoom
- [ ] Test with Windows High Contrast Mode
- [ ] Focus indicators clearly visible
- [ ] Text is readable and clear
- [ ] No content overlap or cut-off

### Manual Testing - Mobile
- [ ] Touch targets large enough (44x44px min)
- [ ] Pinch-to-zoom enabled
- [ ] Orientation lock not enforced
- [ ] Screen reader (TalkBack/VoiceOver) works

### Manual Testing - Motion
- [ ] Test with `prefers-reduced-motion: reduce`
- [ ] Animations respect user preference
- [ ] Auto-playing content can be paused

## Post-Development

### Documentation
- [ ] Document any accessibility features
- [ ] Update component README with a11y notes
- [ ] Add keyboard shortcuts to documentation

### Code Review
- [ ] Peer review for a11y issues
- [ ] Check against this checklist
- [ ] Validate HTML
- [ ] No axe violations

## Common Issues to Avoid

### ❌ Don't
- Use `<div>` for buttons (use `<button>`)
- Remove focus outlines without replacement
- Use placeholder as label
- Open links in new tab without warning
- Auto-play videos without controls
- Use `tabindex` values > 0
- Rely on color alone
- Use generic link text ("click here", "read more")

### ✅ Do
- Use semantic HTML elements
- Provide clear focus indicators
- Label all form inputs
- Warn before opening new windows
- Provide video controls
- Use logical tab order
- Add text/icon to reinforce color
- Use descriptive link text

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## NearBuy Specific

### Components with A11y Features
- `BaseModal`: Focus trap, focus restoration, keyboard navigation
- `AddProductModal`: Form labels, validation
- All buttons: Clear focus indicators

### Known Issues
See `ACCESSIBILITY_AUDIT.md` for current issues and priorities.

### Testing Commands
```bash
# Run unit tests (includes a11y tests)
npm test

# Run tests with UI
npm run test:ui

# Build and check for errors
npm run build

# Start dev server for manual testing
npm run dev
```

---

**Last Updated**: 2025-10-20
**Next Review**: After implementing remaining high-priority issues
