document.addEventListener("DOMContentLoaded", function () {
  const greetingEl = document.getElementById("greetingName");
  const form = document.getElementById("contactForm");
  const errorsBox = document.getElementById("formErrors");
  const submittedDataBox = document.getElementById("submittedData");
  const currentTimeBox = document.getElementById("currentTime");

  let name = localStorage.getItem("guestName");

  if (!name) {
    name = prompt("Hi there! What's your name?");
    if (!name || name.trim() === "") name = "Guest";
    localStorage.setItem("guestName", name);
  }

  if (greetingEl) greetingEl.textContent = name;

  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      errorsBox.textContent = "";

      const values = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        message: document.getElementById("message").value.trim(),
      };

      const errors = validate(values);
      if (errors.length > 0) {
        errorsBox.innerHTML = errors.map(e => `<div>- ${e}</div>`).join("");
        return;
      }

      localStorage.setItem("guestName", values.name);
      if (greetingEl) greetingEl.textContent = values.name;

      showCurrentTime();

      const summaryHtml = `
        <strong>Nama :</strong> ${escapeHtml(values.name)}<br/>
        <strong>Email :</strong> ${escapeHtml(values.email)}<br/>
        <strong>Phone :</strong> ${escapeHtml(values.phone)}<br/>
        <strong>Pesan :</strong> ${escapeHtml(values.message)}
      `;
      submittedDataBox.innerHTML = summaryHtml;

    });
  }

  function showCurrentTime() {
    const now = new Date();
    currentTimeBox.textContent = "Current time : " + now.toString();
  }

  function validate(values) {
    const errors = [];
    if (values.name.length < 2) errors.push("Name must be at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.push("Email must be valid.");
    if (values.phone.replace(/\D/g, "").length < 6)
      errors.push("Phone number looks too short.");
    if (values.message.length < 5)
      errors.push("Message must be at least 5 characters.");
    return errors;
  }

  function escapeHtml(unsafe) {
    return (unsafe + "").replace(/[&<>"'`=\/]/g, s => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    }[s]));
  }
});
