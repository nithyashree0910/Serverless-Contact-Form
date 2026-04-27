
  /* ── toggle radio pill ── */
  function toggleCheck(el) {
    const group = el.closest('.check-group');
    group.querySelectorAll('.check-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    el.querySelector('input').checked = true;
  }

  /* ── consent checkbox ── */
  let consentChecked = false;
  function toggleConsent() {
    consentChecked = !consentChecked;
    document.getElementById('consent-box').classList.toggle('checked', consentChecked);
  }

  /* ── file name display ── */
  function showFileName(input) {
    const el = document.getElementById('file-name');
    el.textContent = input.files[0] ? input.files[0].name : 'PDF, DOCX, PNG up to 10MB';
  }

  /* ── char counter ── */
  document.getElementById('message').addEventListener('input', function () {
    const count = Math.min(this.value.length, 2000);
    document.getElementById('char-count').textContent = count;
    if (this.value.length > 2000) this.value = this.value.slice(0, 2000);
  });

  /* ── validation helpers ── */
  function setError(fieldId, show) {
    const el = document.getElementById(fieldId);
    if (el) el.classList.toggle('has-error', show);
  }

  /* ── form submit ── */
  document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    let valid = true;

    const fname   = document.getElementById('fname').value.trim();
    const lname   = document.getElementById('lname').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const inquiry = document.querySelector('input[name="inquiry"]:checked');

    setError('field-fname',   !fname);
    setError('field-lname',   !lname);
    setError('field-email',   !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    setError('field-subject', !subject);
    setError('field-message', message.length < 10);

    if (!fname || !lname)                                   valid = false;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) valid = false;
    if (!subject)                                           valid = false;
    if (message.length < 10)                               valid = false;

    const inquiryErr = document.getElementById('inquiry-err');
    if (!inquiry) {
      inquiryErr.style.display = 'block'; valid = false;
    } else {
      inquiryErr.style.display = 'none';
    }

    const consentErr = document.getElementById('consent-err');
    if (!consentChecked) {
      consentErr.style.display = 'block'; valid = false;
    } else {
      consentErr.style.display = 'none';
    }

    if (!valid) return;

    /* ── loading state ── */
    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading');

    /* ── build payload ── */
    const payload = {
      firstName:      fname,
      lastName:       lname,
      email:          email,
      phone:          document.getElementById('phone-code').value + document.getElementById('phone').value,
      company:        document.getElementById('company').value.trim(),
      role:           document.getElementById('role').value,
      inquiryType:    inquiry.value,
      priority:       (document.querySelector('input[name="priority"]:checked') || {}).value || 'Medium',
      subject:        subject,
      message:        message,
      contactMethod:  document.getElementById('contact-method').value,
      source:         document.getElementById('source').value,
      rating:         (document.querySelector('input[name="rating"]:checked') || {}).value || null,
      timestamp:      new Date().toISOString(),
    };

    try {
      /* ── replace URL with your Lambda Function URL or API Gateway endpoint ── */
      const LAMBDA_ENDPOINT = 'https://mguo2ryocg.execute-api.ap-south-1.amazonaws.com/contact';

      const res = await fetch(LAMBDA_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Server error');

      const json = await res.json().catch(() => ({}));
      const ticketId = json.ticketId || 'TK-' + Math.random().toString(36).slice(2,8).toUpperCase();
      document.getElementById('ticketId').textContent = 'Ticket #' + ticketId;
      document.getElementById('successOverlay').classList.add('show');

    } catch (err) {
      /* ── fallback: show success UI even if fetch fails (demo mode) ── */
      // const ticketId = 'TK-' + Math.random().toString(36).slice(2,8).toUpperCase();
      // document.getElementById('ticketId').textContent = 'Ticket #' + ticketId;
      // document.getElementById('successOverlay').classList.add('show');
      alert("Error submitting form");
      console.error(err);
    } finally {
      btn.classList.remove('loading');
    }
  });

  /* ── reset ── */
  function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('successOverlay').classList.remove('show');
    document.getElementById('file-name').textContent = 'PDF, DOCX, PNG up to 10MB';
    document.getElementById('char-count').textContent = '0';
    consentChecked = false;
    document.getElementById('consent-box').classList.remove('checked');
    document.querySelectorAll('.check-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.field').forEach(f => f.classList.remove('has-error'));
  }
