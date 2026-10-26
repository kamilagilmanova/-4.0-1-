document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("start-scan-btn");
  const buttonLabel = document.getElementById("button-label");

  const gate = document.getElementById("gate");
  const finalMessage = document.getElementById("final-message");
  const sceneStatus = document.getElementById("scene-status");

  const progressLabel = document.getElementById("progress-label");
  const progressCount = document.getElementById("progress-count");
  const progressFill = document.getElementById("progress-fill");
  const progressTrack = document.getElementById("progress-track");

  const slots = [
    document.getElementById("slot-1"),
    document.getElementById("slot-2"),
    document.getElementById("slot-3")
  ];

  const SCAN_TIME = 1400;
  const REVEAL_DELAY = 250;

  let isScanning = false;

  const wait = (duration) =>
    new Promise((resolve) => setTimeout(resolve, duration));

  function updateProgress(completed) {
    const percentage = (completed / slots.length) * 100;

    progressFill.style.width = `${percentage}%`;
    progressCount.textContent =
      `${String(completed).padStart(2, "0")} / 03`;

    progressTrack.setAttribute("aria-valuenow", String(completed));

    if (completed === 0) {
      progressLabel.textContent = "Ожидание запуска";
    } else if (completed < slots.length) {
      progressLabel.textContent = "Анализ символов...";
    } else {
      progressLabel.textContent = "Расшифровка завершена";
    }
  }

  async function scanGlyph(slot, index) {
    const symbolNumber = String(index + 1).padStart(2, "0");

    sceneStatus.textContent = `АНАЛИЗ СИМВОЛА ${symbolNumber}`;
    progressLabel.textContent = `Анализ символа ${symbolNumber}...`;

    gate.classList.remove("is-scanning");
    void gate.offsetWidth;
    gate.classList.add("is-scanning");

    slot.classList.add("scanning");

    await wait(SCAN_TIME);

    slot.classList.remove("scanning");
    slot.classList.add("scanned");

    updateProgress(index + 1);

    await wait(REVEAL_DELAY);
  }

  async function runScanSequence() {
    if (isScanning) return;

    isScanning = true;
    scanButton.disabled = true;
    scanButton.setAttribute("aria-busy", "true");

    buttonLabel.textContent = "Выполняется анализ...";
    sceneStatus.textContent = "ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА";

    progressLabel.textContent = "Подключение к артефакту";

    await wait(450);

    for (let index = 0; index < slots.length; index++) {
      await scanGlyph(slots[index], index);
    }

    gate.classList.remove("is-scanning");

    sceneStatus.textContent = "ВСЕ СИМВОЛЫ РАСШИФРОВАНЫ";
    progressLabel.textContent = "Послание восстановлено";

    await wait(450);

    finalMessage.classList.add("visible");

    document.querySelector(".intro").classList.add("is-hidden");

    buttonLabel.textContent = "Расшифровка завершена";
    scanButton.classList.add("is-complete");

    buttonLabel.textContent = "Расшифровка завершена";
    scanButton.classList.add("is-complete");
    scanButton.removeAttribute("aria-busy");

    isScanning = false;
  }

  scanButton.addEventListener("click", runScanSequence);

  updateProgress(0);
});
