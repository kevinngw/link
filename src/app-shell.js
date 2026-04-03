export const APP_SHELL_HTML = `
  <main class="screen">
    <header class="screen-header">
      <div class="screen-heading">
        <p id="screen-kicker" class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1 id="screen-title">LINK PULSE</h1>
      </div>
      <div class="screen-toolbar">
        <div class="screen-actions-primary">
          <button id="station-search-toggle" class="theme-toggle station-search-toggle" type="button" aria-label="Open station search">Search</button>
          <button id="language-toggle" class="theme-toggle" type="button" aria-label="Switch to Chinese">中文</button>
          <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
          <button id="status-pill" class="status-pill" type="button" aria-label="Refresh data">SYNC</button>
        </div>
        <div class="screen-actions-secondary">
          <span id="current-time" class="dot-matrix-clock" aria-label="Current time">--:--</span>
          <p id="updated-at" class="status-pill updated-at-pill">Waiting for snapshot</p>
          <button id="about-toggle" class="theme-toggle about-toggle" type="button" aria-label="About Link Pulse">About</button>
        </div>
      </div>
    </header>
    <div class="switcher-stack">
      <section id="system-bar" class="tab-bar system-bar" aria-label="Transit systems"></section>
      <section id="view-bar" class="tab-bar" aria-label="Board views">
        <button class="tab-button is-active" data-tab="map" type="button">Map</button>
        <button class="tab-button" data-tab="trains" type="button" id="tab-trains">Trains</button>
        <button class="tab-button" data-tab="favorites" type="button">Favorites</button>
        <button class="tab-button" data-tab="insights" type="button">Insights</button>
      </section>
    </div>
    <section id="board" class="board"></section>
    <div id="toast-region" class="toast-region" aria-live="polite" aria-atomic="true"></div>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div class="dialog-header-main">
          <div class="dialog-title-wrap">
            <h3 id="dialog-title" class="dialog-title">
              <span id="dialog-title-track" class="dialog-title-track">
                <span id="dialog-title-text" class="dialog-title-text">Station</span>
                <span id="dialog-title-text-clone" class="dialog-title-text dialog-title-text-clone" aria-hidden="true">Station</span>
              </span>
            </h3>
            <div id="dialog-meta" class="dialog-meta">
              <button id="dialog-status-pill" class="status-pill" type="button" aria-label="Refresh data">SYNC</button>
              <p id="dialog-updated-at" class="updated-at">Waiting for snapshot</p>
            </div>
          </div>
          <p id="dialog-service-summary" class="dialog-service-summary">Service summary</p>
        </div>
        <div class="dialog-actions">
          <button id="dialog-favorite" class="dialog-close dialog-favorite-button" type="button" aria-label="Add to favorites">☆</button>
          <button id="dialog-share" class="dialog-close dialog-share-button" type="button" aria-label="Share arrivals">Share</button>
          <button id="dialog-display" class="dialog-close dialog-mode-button" type="button" aria-label="Toggle display mode">Board</button>
          <button id="station-dialog-close" class="dialog-close" type="button" aria-label="Close station dialog">&times;</button>
        </div>
      </header>
      <div class="dialog-direction-bar">
        <div id="dialog-direction-tabs" class="dialog-direction-tabs" aria-label="Board direction view">
          <button id="dir-tab-both" class="dialog-direction-tab is-active" data-dialog-direction="both" type="button">Both</button>
          <button class="dialog-direction-tab" data-dialog-direction="nb" type="button">NB</button>
          <button class="dialog-direction-tab" data-dialog-direction="sb" type="button">SB</button>
        </div>
      </div>
      <div id="station-alerts-container"></div>
      <div class="dialog-body">
        <div class="arrivals-section" data-direction-section="nb">
          <h4 id="arrivals-title-nb" class="arrivals-title">
            <span class="arrivals-title-track">
              <span class="arrivals-title-text">Northbound (▲)</span>
              <span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">Northbound (▲)</span>
            </span>
          </h4>
          <div id="arrivals-nb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-nb" class="arrivals-list"></div></div>
        </div>
        <div class="arrivals-section" data-direction-section="sb">
          <h4 id="arrivals-title-sb" class="arrivals-title">
            <span class="arrivals-title-track">
              <span class="arrivals-title-text">Southbound (▼)</span>
              <span class="arrivals-title-text arrivals-title-clone" aria-hidden="true">Southbound (▼)</span>
            </span>
          </h4>
          <div id="arrivals-sb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-sb" class="arrivals-list"></div></div>
        </div>
      </div>
    </div>
  </dialog>
  <dialog id="train-dialog" class="station-dialog train-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="train-dialog-title">Train</h3>
          <p id="train-dialog-subtitle" class="updated-at">Current movement</p>
        </div>
        <div class="dialog-actions">
          <button id="train-dialog-close" class="dialog-close" type="button" aria-label="Close train dialog">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <div id="train-dialog-line" class="train-detail-line"></div>
        <div id="train-dialog-status" class="train-detail-status"></div>
      </div>
    </div>
  </dialog>
  <dialog id="alert-dialog" class="station-dialog alert-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="alert-dialog-title">Service Alert</h3>
          <p id="alert-dialog-subtitle" class="updated-at">Transit advisory</p>
        </div>
        <div class="dialog-actions">
          <button id="alert-dialog-close" class="dialog-close" type="button" aria-label="Close alert dialog">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <p id="alert-dialog-lines" class="train-detail-status"></p>
        <p id="alert-dialog-body" class="alert-dialog-body"></p>
        <a id="alert-dialog-link" class="alert-dialog-link" href="" target="_blank" rel="noreferrer">Read official alert</a>
      </div>
    </div>
  </dialog>
  <dialog id="station-search-dialog" class="station-dialog station-search-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="station-search-title">Station search</h3>
          <p id="station-search-summary" class="dialog-service-summary">Jump straight to any station across loaded systems.</p>
        </div>
        <div class="dialog-actions">
          <button id="station-search-close" class="dialog-close" type="button" aria-label="Close station search">&times;</button>
        </div>
      </header>
      <div class="station-search-shell">
        <label class="sr-only" for="station-search-input">Station search</label>
        <input id="station-search-input" class="station-search-input" type="search" placeholder="Search stations, lines, or systems" autocomplete="off" spellcheck="false" />
        <div class="station-search-actions">
          <button id="station-location-button" class="station-location-button" type="button">Use my location</button>
          <p id="station-location-status" class="station-location-status updated-at"></p>
        </div>
        <p id="station-search-meta" class="updated-at">Press / to search</p>
        <div id="station-search-results" class="station-search-results"></div>
      </div>
    </div>
  </dialog>
  <dialog id="insights-detail-dialog" class="station-dialog train-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="insights-detail-title">Details</h3>
          <p id="insights-detail-subtitle" class="updated-at"></p>
        </div>
        <div class="dialog-actions">
          <button id="insights-detail-close" class="dialog-close" type="button" aria-label="Close details">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <div id="insights-detail-body"></div>
      </div>
    </div>
  </dialog>
  <dialog id="about-dialog" class="station-dialog about-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="about-dialog-title">About Link Pulse</h3>
          <p id="about-dialog-summary" class="dialog-service-summary">Privacy, support, and release info</p>
        </div>
        <div class="dialog-actions">
          <button id="about-dialog-close" class="dialog-close" type="button" aria-label="Close about dialog">&times;</button>
        </div>
      </header>
      <div id="about-dialog-body" class="about-dialog-body"></div>
    </div>
  </dialog>
`

export function renderAppShell(rootElement) {
  rootElement.innerHTML = APP_SHELL_HTML
}
