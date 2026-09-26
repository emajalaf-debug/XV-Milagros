/* =========================================================
   CONFIGURACIÓN — Editá estos valores con tus datos reales.
   No hace falta tocar el resto del archivo.
========================================================= */
const CONFIG = {
  // Número de WhatsApp que recibirá las confirmaciones.
  // Formato: código de país + número, SIN espacios, sin "+" ni "00".
  // Ejemplo Argentina (Buenos Aires, cel): "5491122334455"
  whatsappNumber: "5492644148847",

  // Link directo de Google Maps a la ubicación exacta (botón "Ver mapa").
  mapsUrl: "https://www.google.com/maps/place/Quinta+%22La+So%C3%B1ada%22/@-31.6776408,-68.503372,17z/data=!4m12!1m5!3m4!2zMzHCsDQwJzM5LjUiUyA2OMKwMzAnMDIuOSJX!8m2!3d-31.6776408!4d-68.5007971!3m5!1s0x968117b9e2316025:0xf34b14e126b5f6c3!8m2!3d-31.6783698!4d-68.5000692!16s%2Fg%2F11tjn090hr?hl=es",

  // Fecha y hora exacta del evento (para el contador de la portada).
  // Formato: "AAAA-MM-DDTHH:MM:SS"
  eventDateTime: "2026-11-21T21:00:00",
};

/* ========================= MENÚ ========================= */
const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");

function closeMenu() {
  menuOverlay.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
  const isOpen = menuOverlay.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".menu-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// El rectángulo del header sólo se ve mientras la foto de portada está
// visible; al pasarla, desaparece y quedan sólo las tres rayitas. Al
// volver a la portada, reaparece.
const siteHeader = document.querySelector(".site-header");
const heroEl = document.querySelector(".hero");

if (siteHeader && heroEl && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        siteHeader.classList.toggle("is-scrolled", !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );
  headerObserver.observe(heroEl);
} else if (siteHeader) {
  function updateHeaderScrollState() {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
  updateHeaderScrollState();
}

/* ===================== MAPA (LUGAR) ===================== */
const mapLink = document.getElementById("mapLink");
if (mapLink) {
  mapLink.href = CONFIG.mapsUrl;
}

/* =============== AGREGAR A MI CALENDARIO (Google Calendar) =========== */
const calendarLink = document.getElementById("calendarLink");
if (calendarLink) {
  // Fecha y hora del evento en formato UTC (AAAAMMDDTHHMMSSZ).
  // Ajustá estas dos líneas si cambia la fecha/hora de la fiesta.
  const eventStartUTC = "20261122T000000Z"; // 21/11/2026 21:00 hs (ART, UTC-3)
  const eventEndUTC = "20261122T070000Z"; // 22/11/2026 04:00 hs (ART, UTC-3)

  const calendarParams = new URLSearchParams({
    action: "TEMPLATE",
    text: "Mis 15 Años - Milagros",
    dates: `${eventStartUTC}/${eventEndUTC}`,
    details: "¡Los espero para celebrar mis 15 años!",
    location: "Quinta \"La Soñada\"",
  });

  calendarLink.href = `https://calendar.google.com/calendar/render?${calendarParams.toString()}`;
}

/* ===================== MÚSICA DE FONDO =================== */
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");

function setMusicIcon(isMuted) {
  muteBtn.classList.toggle("is-muted", isMuted);
  muteIcon.textContent = isMuted ? "✕" : "♪";
}

// Arrancamos SIN intentar autoplay: así evitamos cualquier bloqueo o
// comportamiento inconsistente del navegador. El botón empieza mostrando
// "bloqueado" y es 100% quien decide cuándo suena.
bgMusic.volume = 0.5;
bgMusic.pause();
setMusicIcon(true);

// Un solo control, simple y confiable: cada toque alterna reproducir/pausar.
muteBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    setMusicIcon(false);
  } else {
    bgMusic.pause();
    setMusicIcon(true);
  }
});

/* =================== CONFIRMAR ASISTENCIA ================= */
const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("rsvpName").value.trim();
  const asistencia = document.getElementById("rsvpAttend").value;
  const guestsField = document.getElementById("rsvpGuests");
  let acompanantes = guestsField.value;
  const dieta = document.getElementById("rsvpDiet").value;
  const mensaje = document.getElementById("rsvpMessage").value.trim();

  // Si esta invitación tiene un cupo fijo asignado, no se puede confirmar
  // una cantidad mayor a ese cupo.
  if (guestsField.max) {
    const max = parseInt(guestsField.max, 10);
    const valor = parseInt(acompanantes, 10);
    if (!Number.isNaN(max) && (Number.isNaN(valor) || valor > max)) {
      alert(`Esta invitación tiene un cupo de ${max} ${max === 1 ? "persona" : "personas"}. Ingresá un número igual o menor.`);
      guestsField.focus();
      return;
    }
  }

  const lines = [
    "¡Hola! Quiero confirmar mi asistencia al cumpleaños de 15 de Milagros.",
    "",
    `Nombre: ${nombre}`,
    `Asistencia: ${asistencia}`,
    `Acompañantes: ${acompanantes}`,
    `Restricciones alimentarias: ${dieta}`,
  ];

  if (mensaje) {
    lines.push("", `Mensaje: ${mensaje}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
  window.open(url, "_blank", "noopener");
});

/* ============ ITINERARIO: efecto de "pintado" al scrollear ============ */
const timelineItems = document.querySelectorAll(".timeline-item");
const timelineFill = document.getElementById("timelineFill");

function updateTimelineProgress() {
  if (!timelineItems.length || !timelineFill) return;

  // Punto de la pantalla en el que un hito se considera "alcanzado".
  const triggerLine = window.innerHeight * 0.75;
  let filledHeight = 0;

  timelineItems.forEach((item) => {
    const dot = item.querySelector(".timeline-dot");
    const reached = dot.getBoundingClientRect().top <= triggerLine;
    item.classList.toggle("is-filled", reached);
    if (reached) {
      const dotCenter = dot.offsetTop + dot.offsetHeight / 2;
      filledHeight = Math.max(filledHeight, dotCenter);
    }
  });

  timelineFill.style.height = `${filledHeight}px`;
}

window.addEventListener("scroll", updateTimelineProgress, { passive: true });
window.addEventListener("resize", updateTimelineProgress);
updateTimelineProgress();

/* ===================== CONTADOR REGRESIVO ===================== */
const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");
const countdownEl = document.getElementById("countdown");

if (cdDays && cdHours && cdMinutes && cdSeconds) {
  const eventDate = new Date(CONFIG.eventDateTime);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const diff = eventDate.getTime() - Date.now();

    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      clearInterval(countdownTimer);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  const countdownTimer = setInterval(updateCountdown, 1000);
}

/* ============ ANIMACIONES DE APARICIÓN AL SCROLLEAR ============ */
const revealEls = document.querySelectorAll(".reveal, .reveal-item");

if (revealEls.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Se agrega y se quita según entra o sale de la pantalla,
        // así el efecto se repite cada vez que lo volvés a ver.
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // Sin soporte de IntersectionObserver: mostramos todo directamente.
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ============ DATOS PERSONALIZADOS (por familia/cantidad) ============
   Si el link incluye ?familia=NOMBRE&cupo=NUMERO, se muestra una tarjeta
   fija con esos datos en la sección de Confirmación y se precargan en el
   formulario. Pensado para que el organizador genere un link distinto
   para cada familia (ver el panel privado del organizador). */
(function () {
  const params = new URLSearchParams(window.location.search);
  const familia = params.get("familia");
  const cupo = params.get("cupo");

  if (!familia && !cupo) return;

  // Cartel fijo (no editable) en la sección de Confirmación, con el
  // nombre y el cupo que cargó el organizador — esto no se puede
  // modificar desde el formulario, queda como dato de referencia.
  const inviteCard = document.getElementById("inviteCard");
  const inviteCardName = document.getElementById("inviteCardName");
  const inviteCardCupo = document.getElementById("inviteCardCupo");
  if (inviteCard) {
    if (familia) inviteCardName.textContent = familia;
    else inviteCardName.remove();

    if (cupo) {
      inviteCardCupo.textContent = `Cupo asignado: ${cupo} ${cupo === "1" ? "persona" : "personas"}`;
    } else {
      inviteCardCupo.remove();
    }
    inviteCard.hidden = false;
  }

  const nameField = document.getElementById("rsvpName");
  if (nameField && familia) nameField.value = familia;

  // El campo de acompañantes queda limitado al cupo asignado, y arranca
  // completo (asumiendo que confirman todos, y lo bajan si van menos).
  const guestsField = document.getElementById("rsvpGuests");
  const guestsLabel = document.getElementById("rsvpGuestsLabel");
  if (guestsField && cupo) {
    const n = parseInt(cupo, 10);
    if (!Number.isNaN(n)) {
      guestsField.max = n;
      guestsField.value = n;
      if (guestsLabel) {
        guestsLabel.textContent = `¿Cuántos de las ${n} personas invitadas van a asistir?`;
      }
      // Si escriben o pegan un número más alto que el cupo, lo bajamos
      // automáticamente al máximo permitido.
      guestsField.addEventListener("input", () => {
        const valor = parseInt(guestsField.value, 10);
        if (!Number.isNaN(valor) && valor > n) {
          guestsField.value = n;
        }
      });
    }
  }
})();

/* ============ PANEL DEL ORGANIZADOR ============
   Se puede abrir de dos formas: con el link ?panel=organizador (ideal
   una vez publicado en Vercel, para guardarlo en favoritos), o tocando
   el puntito disimulado al pie de página. En ambos casos pide una
   clave simple (con un cartel propio, no el de Chrome) antes de
   mostrar el panel, para que un invitado que encuentre el puntito o
   el link no pueda entrar sin saberla. */
(function () {
  // Cambiá esta clave por la que quieras usar vos.
  const HOST_PASSCODE = "milagros15";

  const hostPanel = document.getElementById("hostPanel");
  const hostTrigger = document.getElementById("hostModeTrigger");
  if (!hostPanel) return;

  const passcodeOverlay = document.getElementById("passcodeOverlay");
  const passcodeInput = document.getElementById("passcodeInput");
  const passcodeError = document.getElementById("passcodeError");
  const passcodeSubmit = document.getElementById("passcodeSubmit");
  const passcodeCancel = document.getElementById("passcodeCancel");

  function revealHostPanel() {
    document.body.classList.add("host-mode");
    hostPanel.hidden = false;
    window.scrollTo(0, 0);
  }

  function closePasscodeCard() {
    passcodeOverlay.hidden = true;
    passcodeInput.value = "";
    passcodeError.hidden = true;
  }

  function tryPasscode() {
    const intentada = passcodeInput.value.trim().toLowerCase();
    if (intentada === HOST_PASSCODE.toLowerCase()) {
      closePasscodeCard();
      revealHostPanel();
    } else {
      passcodeError.hidden = false;
      passcodeInput.classList.remove("is-shake");
      // Forzamos un reflow para poder repetir la animación de sacudida.
      void passcodeInput.offsetWidth;
      passcodeInput.classList.add("is-shake");
      passcodeInput.select();
    }
  }

  function openPasscodeCard() {
    passcodeOverlay.hidden = false;
    passcodeError.hidden = true;
    passcodeInput.value = "";
    setTimeout(() => passcodeInput.focus(), 50);
  }

  if (passcodeSubmit) passcodeSubmit.addEventListener("click", tryPasscode);
  if (passcodeCancel) passcodeCancel.addEventListener("click", closePasscodeCard);
  if (passcodeInput) {
    passcodeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") tryPasscode();
    });
  }
  if (passcodeOverlay) {
    passcodeOverlay.addEventListener("click", (e) => {
      if (e.target === passcodeOverlay) closePasscodeCard();
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("panel") === "organizador") {
    openPasscodeCard();
  }

  if (hostTrigger) {
    hostTrigger.addEventListener("click", openPasscodeCard);
  }

  const step1 = document.getElementById("hostStep1");
  const step2 = document.getElementById("hostStep2");
  const familiaInput = document.getElementById("hostFamilia");
  const cupoInput = document.getElementById("hostCupo");
  const generateBtn = document.getElementById("hostGenerateBtn");
  const backBtn = document.getElementById("hostBackBtn");
  const summaryEl = document.getElementById("hostSummary");
  const linkOutput = document.getElementById("hostLinkOutput");
  const copyBtn = document.getElementById("hostCopyBtn");
  const copiedMsg = document.getElementById("hostCopiedMsg");
  const waBtn = document.getElementById("hostWaBtn");

  // La base es esta misma página, sin sus parámetros actuales.
  const baseUrl = window.location.origin + window.location.pathname;

  let currentLink = "";
  let currentFamilia = "";
  let currentCupo = "";

  function buildMessage() {
    let saludo = "¡Hola!";
    if (currentFamilia) saludo = `¡Hola, ${currentFamilia}!`;
    let cupoTexto = "";
    if (currentCupo) {
      cupoTexto = ` Te dejo un cupo para ${currentCupo} ${currentCupo === "1" ? "persona" : "personas"}.`;
    }
    return `${saludo} Hay momentos en la vida que solo cobran sentido cuando los compartimos con la gente que queremos y que hace especial nuestro día a día. Mis 15 años son una alegría enorme y, en una noche tan importante para mí, tu presencia no puede faltar.\n\nMe encantaría que me acompañes a celebrar.${cupoTexto} Encontrá toda la información y confirmá tu asistencia acá: ${currentLink}`;
  }

  generateBtn.addEventListener("click", () => {
    const familia = familiaInput.value.trim();
    const cupo = cupoInput.value.trim();

    if (!familia && !cupo) {
      alert("Completá al menos el nombre y la cantidad de personas.");
      return;
    }

    const linkParams = new URLSearchParams();
    if (familia) linkParams.set("familia", familia);
    if (cupo) linkParams.set("cupo", cupo);

    currentLink = `${baseUrl}?${linkParams.toString()}`;
    currentFamilia = familia;
    currentCupo = cupo;

    linkOutput.value = currentLink;
    copiedMsg.hidden = true;

    summaryEl.textContent = familia
      ? `Invitación lista para ${familia}${cupo ? ` (${cupo} ${cupo === "1" ? "persona" : "personas"})` : ""}.`
      : `Invitación lista para ${cupo} ${cupo === "1" ? "persona" : "personas"}.`;

    step1.hidden = true;
    step2.hidden = false;
  });

  backBtn.addEventListener("click", () => {
    step2.hidden = true;
    step1.hidden = false;
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(linkOutput.value);
    } catch (e) {
      linkOutput.select();
      document.execCommand("copy");
    }
    copiedMsg.hidden = false;
  });

  waBtn.addEventListener("click", () => {
    const mensaje = buildMessage();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener");
  });
})();
