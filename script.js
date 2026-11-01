/* No trackers, external libraries, network requests, or form storage. */
(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  function closeMenu(returnFocus = false) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    mobileNav.hidden = true;
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
      mobileNav.hidden = false;
    }
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  const wideScreen = window.matchMedia('(min-width: 801px)');
  wideScreen.addEventListener('change', event => { if (event.matches) closeMenu(); });

  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function activateTab(tab, moveFocus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }

  const form = document.getElementById('contact-form');
  const fields = ['name', 'email', 'message'].map(id => document.getElementById(id));
  const summary = document.getElementById('form-errors');
  const status = document.getElementById('form-status');
  function validate(field) {
    const value = field.value.trim();
    let error = '';
    if (!value) error = field.id === 'name' ? 'Please enter a sample name.' : field.id === 'email' ? 'Please enter a sample email address.' : 'Please enter a sample message.';
    else if (field.id === 'email' && field.validity.typeMismatch) error = 'Use a valid email format, such as alex@example.com.';
    else if (field.id === 'message' && value.length < 10) error = 'Please write at least 10 characters.';
    document.getElementById(field.id + '-error').textContent = error;
    if (error) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return !error;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.hasAttribute('aria-invalid')) validate(field);
    if (fields.every(item => !item.hasAttribute('aria-invalid'))) summary.hidden = true;
    status.hidden = true;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = true;
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      const count = fields.filter(field => field.hasAttribute('aria-invalid')).length;
      summary.textContent = 'Please check ' + count + (count === 1 ? ' field' : ' fields') + ' below. This is a demo; use sample details.';
      summary.hidden = false;
      fields.find(field => field.hasAttribute('aria-invalid')).focus();
      return;
    }
    summary.hidden = true;
    status.textContent = 'Demo complete! Your form passed validation. No message was sent or stored. Thanks for exploring Lucky Coffee.';
    status.hidden = false;
    form.reset();
    status.focus({ preventScroll: true });
  });
  // Enable controls only after the local-only submit handler is installed.
  document.getElementById('demo-fields').disabled = false;
})();
