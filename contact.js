const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const subject = `[DB PLAY] ${data.get('topic')}`;
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${data.get('topic')}\n\n${data.get('message')}`;
    const status = document.getElementById('formStatus');

    status.textContent = 'Your message has been prepared in your email app. If nothing opened, your browser may not have a default email app set up.';

    // CHANGE THIS to your real email address:
    window.location.href = `mailto:YOUR-EMAIL@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}