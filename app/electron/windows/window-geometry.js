const { screen } = require("electron");

const PROMPT_WINDOW_MIN_HEIGHT = 140;
const PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT = 120;
const PROMPT_WINDOW_MAX_HEIGHT = 640;
const WINDOW_WIDTH = 480;
const TOP_MARGIN = 24;
const SETTINGS_WINDOW_WIDTH = 720;
const SETTINGS_WINDOW_HEIGHT = 560;

function getActiveDisplay() {
  return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
}

/** Keep the window on the current Space, including over other apps in fullscreen. */
function configureMacOverlayWindow(win, isMac) {
  if (!isMac) return;

  win.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    skipTransformProcessType: true,
  });
  win.setAlwaysOnTop(true, "floating", 1);
  win.setFullScreenable(false);
}

function positionWindowTopCenter(win, display = getActiveDisplay()) {
  const { x: areaX, y: areaY, width: areaW } = display.workArea;
  const [winW] = win.getSize();
  const x = Math.round(areaX + (areaW - winW) / 2);
  const y = Math.round(areaY + TOP_MARGIN);
  win.setPosition(x, y, false);
}

function getLayoutHeight(mode, contentHeight, currentHeight) {
  if (mode === "prompt" || mode === "onboarding" || mode === "expanded") {
    if (typeof contentHeight === "number" && contentHeight > 0) {
      return Math.min(
        Math.max(Math.round(contentHeight), PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT),
        PROMPT_WINDOW_MAX_HEIGHT,
      );
    }
    // Keep the current height when expanding so the window doesn't shrink then grow.
    if (
      mode === "expanded" &&
      typeof currentHeight === "number" &&
      currentHeight > 0
    ) {
      return Math.min(
        Math.max(currentHeight, PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT),
        PROMPT_WINDOW_MAX_HEIGHT,
      );
    }
    return PROMPT_WINDOW_MIN_HEIGHT;
  }
  return PROMPT_WINDOW_MIN_HEIGHT;
}

module.exports = {
  PROMPT_WINDOW_MIN_HEIGHT,
  PROMPT_WINDOW_ABSOLUTE_MIN_HEIGHT,
  PROMPT_WINDOW_MAX_HEIGHT,
  WINDOW_WIDTH,
  TOP_MARGIN,
  SETTINGS_WINDOW_WIDTH,
  SETTINGS_WINDOW_HEIGHT,
  getActiveDisplay,
  configureMacOverlayWindow,
  positionWindowTopCenter,
  getLayoutHeight,
};
