// Animación suave del scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});
const form = document.querySelector(".form-contacto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = form.querySelector('input[type="text"]').value;
  const correo = form.querySelector('input[type="email"]').value;
  const mensaje = form.querySelector("textarea").value;

  const res = await fetch("http://localhost:3000/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, mensaje })
  });

  const data = await res.json();
  if (data.success) {
    alert("✅ Mensaje enviado con éxito");
    form.reset();
  } else {
    alert("❌ Ocurrió un error al enviar el mensaje");
  }
});

