/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export default `<!DOCTYPE html>
<html lang="en" class="no-js">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <meta name="description" content="Project documentation with Markdown." />

    <link rel="canonical" href="https://www.mkdocs.org/" />

    <meta name="author" content="MkDocs Team" />

    <link rel="shortcut icon" href="assets/images/favicon.png" />
    <meta name="generator" content="mkdocs-1.1.2, mkdocs-material-5.3.2" />

    <title>MkDocs</title>

    <link rel="stylesheet" href="assets/stylesheets/main.fe0cca5b.min.css" />

    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,700%7CRoboto+Mono&display=fallback"
    />
    <style>
      body,
      input {
        font-family: 'Roboto', -apple-system, BlinkMacSystemFont, Helvetica,
          Arial, sans-serif;
      }
      code,
      kbd,
      pre {
        font-family: 'Roboto Mono', SFMono-Regular, Consolas, Menlo, monospace;
      }
    </style>

    <script>
      (window.ga =
        window.ga ||
        function () {
          (ga.q = ga.q || []).push(arguments);
        }),
        (ga.l = +new Date()),
        ga('create', 'UA-27795084-5', 'mkdocs.org'),
        ga('set', 'anonymizeIp', !0),
        ga('send', 'pageview'),
        document.addEventListener('DOMContentLoaded', function () {
          document.forms.search &&
            document.forms.search.query.addEventListener('blur', function () {
              if (this.value) {
                var e = document.location.pathname;
                ga('send', 'pageview', e + '?q=' + this.value);
              }
            });
        }),
        document.addEventListener('DOMContentSwitch', function () {
          ga('send', 'pageview');
        });
    </script>
    <script async src="https://www.google-analytics.com/analytics.js"></script>
  </head>

  <body dir="ltr">
    <input
      class="md-toggle"
      data-md-toggle="drawer"
      type="checkbox"
      id="__drawer"
      autocomplete="off"
    />
    <input
      class="md-toggle"
      data-md-toggle="search"
      type="checkbox"
      id="__search"
      autocomplete="off"
    />
    <label class="md-overlay" for="__drawer"></label>
    <div data-md-component="skip">
      <a href="#mkdocs" class="md-skip">
        Skip to content
      </a>
    </div>
    <div data-md-component="announce"></div>

    <header class="md-header" data-md-component="header">
      <nav class="md-header-nav md-grid" aria-label="Header">
        <a
          href="https://www.mkdocs.org"
          title="MkDocs"
          class="md-header-nav__button md-logo"
          aria-label="MkDocs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 8a3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3m0 3.54C9.64 9.35 6.5 8 3 8v11c3.5 0 6.64 1.35 9 3.54 2.36-2.19 5.5-3.54 9-3.54V8c-3.5 0-6.64 1.35-9 3.54z"
            />
          </svg>
        </a>
        <label class="md-header-nav__button md-icon" for="__drawer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z" />
          </svg>
        </label>
        <div class="md-header-nav__title" data-md-component="header-title">
          <div class="md-header-nav__ellipsis">
            <span class="md-header-nav__topic md-ellipsis">
              MkDocs
            </span>
            <span class="md-header-nav__topic md-ellipsis">
              Home
            </span>
          </div>
        </div>

        <label class="md-header-nav__button md-icon" for="__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"
            />
          </svg>
        </label>

        <div class="md-search" data-md-component="search" role="dialog">
          <label class="md-search__overlay" for="__search"></label>
          <div class="md-search__inner" role="search">
            <form class="md-search__form" name="search">
              <input
                type="text"
                class="md-search__input"
                name="query"
                aria-label="Search"
                placeholder="Search"
                autocapitalize="off"
                autocorrect="off"
                autocomplete="off"
                spellcheck="false"
                data-md-component="search-query"
                data-md-state="active"
              />
              <label class="md-search__icon md-icon" for="__search">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"
                  />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"
                  />
                </svg>
              </label>
              <button
                type="reset"
                class="md-search__icon md-icon"
                aria-label="Clear"
                data-md-component="search-reset"
                tabindex="-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  />
                </svg>
              </button>
            </form>
            <div class="md-search__output">
              <div class="md-search__scrollwrap" data-md-scrollfix>
                <div class="md-search-result" data-md-component="search-result">
                  <div class="md-search-result__meta">
                    Initializing search
                  </div>
                  <ol class="md-search-result__list"></ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="md-header-nav__source">
          <a
            href="https://github.com/mkdocs/mkdocs/"
            title="Go to repository"
            class="md-source"
          >
            <div class="md-source__icon md-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  d="M439.55 236.05L244 40.45a28.87 28.87 0 00-40.81 0l-40.66 40.63 51.52 51.52c27.06-9.14 52.68 16.77 43.39 43.68l49.66 49.66c34.23-11.8 61.18 31 35.47 56.69-26.49 26.49-70.21-2.87-56-37.34L240.22 199v121.85c25.3 12.54 22.26 41.85 9.08 55a34.34 34.34 0 01-48.55 0c-17.57-17.6-11.07-46.91 11.25-56v-123c-20.8-8.51-24.6-30.74-18.64-45L142.57 101 8.45 235.14a28.86 28.86 0 000 40.81l195.61 195.6a28.86 28.86 0 0040.8 0l194.69-194.69a28.86 28.86 0 000-40.81z"
                />
              </svg>
            </div>
            <div class="md-source__repository">
              GitHub
            </div>
          </a>
        </div>
      </nav>
    </header>

    <div class="md-container" data-md-component="container">
      <main class="md-main" data-md-component="main">
        <div class="md-main__inner md-grid">
          <div
            class="md-sidebar md-sidebar--primary"
            data-md-component="navigation"
          >
            <div class="md-sidebar__scrollwrap">
              <div class="md-sidebar__inner">
                <nav
                  class="md-nav md-nav--primary"
                  aria-label="Navigation"
                  data-md-level="0"
                >
                  <label class="md-nav__title" for="__drawer">
                    <a
                      href="https://www.mkdocs.org"
                      title="MkDocs"
                      class="md-nav__button md-logo"
                      aria-label="MkDocs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 8a3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3m0 3.54C9.64 9.35 6.5 8 3 8v11c3.5 0 6.64 1.35 9 3.54 2.36-2.19 5.5-3.54 9-3.54V8c-3.5 0-6.64 1.35-9 3.54z"
                        />
                      </svg>
                    </a>
                    MkDocs
                  </label>

                  <div class="md-nav__source">
                    <a
                      href="https://github.com/mkdocs/mkdocs/"
                      title="Go to repository"
                      class="md-source"
                    >
                      <div class="md-source__icon md-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path
                            d="M439.55 236.05L244 40.45a28.87 28.87 0 00-40.81 0l-40.66 40.63 51.52 51.52c27.06-9.14 52.68 16.77 43.39 43.68l49.66 49.66c34.23-11.8 61.18 31 35.47 56.69-26.49 26.49-70.21-2.87-56-37.34L240.22 199v121.85c25.3 12.54 22.26 41.85 9.08 55a34.34 34.34 0 01-48.55 0c-17.57-17.6-11.07-46.91 11.25-56v-123c-20.8-8.51-24.6-30.74-18.64-45L142.57 101 8.45 235.14a28.86 28.86 0 000 40.81l195.61 195.6a28.86 28.86 0 0040.8 0l194.69-194.69a28.86 28.86 0 000-40.81z"
                          />
                        </svg>
                      </div>
                      <div class="md-source__repository">
                        GitHub
                      </div>
                    </a>
                  </div>

                  <ul class="md-nav__list" data-md-scrollfix>
                    <li class="md-nav__item md-nav__item--active">
                      <input
                        class="md-nav__toggle md-toggle"
                        data-md-toggle="toc"
                        type="checkbox"
                        id="__toc"
                      />

                      <label
                        class="md-nav__link md-nav__link--active"
                        for="__toc"
                      >
                        Home
                        <span class="md-nav__icon md-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M3 9h14V7H3v2m0 4h14v-2H3v2m0 4h14v-2H3v2m16 0h2v-2h-2v2m0-10v2h2V7h-2m0 6h2v-2h-2v2z"
                            />
                          </svg>
                        </span>
                      </label>

                      <a
                        href="."
                        title="Home"
                        class="md-nav__link md-nav__link--active"
                      >
                        Home
                      </a>

                      <nav
                        class="md-nav md-nav--secondary"
                        aria-label="Table of contents"
                      >
                        <label class="md-nav__title" for="__toc">
                          <span class="md-nav__icon md-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"
                              />
                            </svg>
                          </span>
                          Table of contents
                        </label>
                        <ul class="md-nav__list" data-md-scrollfix>
                          <li class="md-nav__item">
                            <a href="#overview" class="md-nav__link">
                              Overview
                            </a>

                            <nav class="md-nav" aria-label="Overview">
                              <ul class="md-nav__list">
                                <li class="md-nav__item">
                                  <a href="#host-anywhere" class="md-nav__link">
                                    Host anywhere
                                  </a>
                                </li>

                                <li class="md-nav__item">
                                  <a
                                    href="#great-themes-available"
                                    class="md-nav__link"
                                  >
                                    Great themes available
                                  </a>
                                </li>

                                <li class="md-nav__item">
                                  <a
                                    href="#preview-your-site-as-you-work"
                                    class="md-nav__link"
                                  >
                                    Preview your site as you work
                                  </a>
                                </li>

                                <li class="md-nav__item">
                                  <a
                                    href="#easy-to-customize"
                                    class="md-nav__link"
                                  >
                                    Easy to customize
                                  </a>
                                </li>
                              </ul>
                            </nav>
                          </li>

                          <li class="md-nav__item">
                            <a href="#installation" class="md-nav__link">
                              Installation
                            </a>

                            <nav class="md-nav" aria-label="Installation">
                              <ul class="md-nav__list">
                                <li class="md-nav__item">
                                  <a
                                    href="#install-with-a-package-manager"
                                    class="md-nav__link"
                                  >
                                    Install with a Package Manager
                                  </a>
                                </li>

                                <li class="md-nav__item">
                                  <a
                                    href="#manual-installation"
                                    class="md-nav__link"
                                  >
                                    Manual Installation
                                  </a>

                                  <nav
                                    class="md-nav"
                                    aria-label="Manual Installation"
                                  >
                                    <ul class="md-nav__list">
                                      <li class="md-nav__item">
                                        <a
                                          href="#installing-python"
                                          class="md-nav__link"
                                        >
                                          Installing Python
                                        </a>
                                      </li>

                                      <li class="md-nav__item">
                                        <a
                                          href="#installing-pip"
                                          class="md-nav__link"
                                        >
                                          Installing pip
                                        </a>
                                      </li>

                                      <li class="md-nav__item">
                                        <a
                                          href="#installing-mkdocs"
                                          class="md-nav__link"
                                        >
                                          Installing MkDocs
                                        </a>
                                      </li>
                                    </ul>
                                  </nav>
                                </li>
                              </ul>
                            </nav>
                          </li>

                          <li class="md-nav__item">
                            <a href="#getting-started" class="md-nav__link">
                              Getting Started
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a href="#adding-pages" class="md-nav__link">
                              Adding pages
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="#theming-our-documentation"
                              class="md-nav__link"
                            >
                              Theming our documentation
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="#changing-the-favicon-icon"
                              class="md-nav__link"
                            >
                              Changing the Favicon Icon
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a href="#building-the-site" class="md-nav__link">
                              Building the site
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="#other-commands-and-options"
                              class="md-nav__link"
                            >
                              Other Commands and Options
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a href="#deploying" class="md-nav__link">
                              Deploying
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a href="#getting-help" class="md-nav__link">
                              Getting help
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </li>

                    <li class="md-nav__item md-nav__item--nested">
                      <input
                        class="md-nav__toggle md-toggle"
                        data-md-toggle="nav-2"
                        type="checkbox"
                        id="nav-2"
                      />

                      <label class="md-nav__link" for="nav-2">
                        User Guide
                        <span class="md-nav__icon md-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"
                            />
                          </svg>
                        </span>
                      </label>
                      <nav
                        class="md-nav"
                        aria-label="User Guide"
                        data-md-level="1"
                      >
                        <label class="md-nav__title" for="nav-2">
                          <span class="md-nav__icon md-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"
                              />
                            </svg>
                          </span>
                          User Guide
                        </label>
                        <ul class="md-nav__list" data-md-scrollfix>
                          <li class="md-nav__item">
                            <a
                              href="user-guide/writing-your-docs/"
                              title="Writing Your Docs"
                              class="md-nav__link"
                            >
                              Writing Your Docs
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="user-guide/styling-your-docs/"
                              title="Styling Your Docs"
                              class="md-nav__link"
                            >
                              Styling Your Docs
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="user-guide/configuration/"
                              title="Configuration"
                              class="md-nav__link"
                            >
                              Configuration
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="user-guide/deploying-your-docs/"
                              title="Deploying Your Docs"
                              class="md-nav__link"
                            >
                              Deploying Your Docs
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="user-guide/custom-themes/"
                              title="Custom Themes"
                              class="md-nav__link"
                            >
                              Custom Themes
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="user-guide/plugins/"
                              title="Plugins"
                              class="md-nav__link"
                            >
                              Plugins
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </li>

                    <li class="md-nav__item md-nav__item--nested">
                      <input
                        class="md-nav__toggle md-toggle"
                        data-md-toggle="nav-3"
                        type="checkbox"
                        id="nav-3"
                      />

                      <label class="md-nav__link" for="nav-3">
                        About
                        <span class="md-nav__icon md-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z"
                            />
                          </svg>
                        </span>
                      </label>
                      <nav class="md-nav" aria-label="About" data-md-level="1">
                        <label class="md-nav__title" for="nav-3">
                          <span class="md-nav__icon md-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"
                              />
                            </svg>
                          </span>
                          About
                        </label>
                        <ul class="md-nav__list" data-md-scrollfix>
                          <li class="md-nav__item">
                            <a
                              href="about/release-notes/"
                              title="Release Notes"
                              class="md-nav__link"
                            >
                              Release Notes
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="about/contributing/"
                              title="Contributing"
                              class="md-nav__link"
                            >
                              Contributing
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="about/license/"
                              title="License"
                              class="md-nav__link"
                            >
                              License
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div class="md-sidebar md-sidebar--secondary" data-md-component="toc">
            <div class="md-sidebar__scrollwrap">
              <div class="md-sidebar__inner">
                <nav
                  class="md-nav md-nav--secondary"
                  aria-label="Table of contents"
                >
                  <label class="md-nav__title" for="__toc">
                    <span class="md-nav__icon md-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z"
                        />
                      </svg>
                    </span>
                    Table of contents
                  </label>
                  <ul class="md-nav__list" data-md-scrollfix>
                    <li class="md-nav__item">
                      <a href="#overview" class="md-nav__link">
                        Overview
                      </a>

                      <nav class="md-nav" aria-label="Overview">
                        <ul class="md-nav__list">
                          <li class="md-nav__item">
                            <a href="#host-anywhere" class="md-nav__link">
                              Host anywhere
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="#great-themes-available"
                              class="md-nav__link"
                            >
                              Great themes available
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a
                              href="#preview-your-site-as-you-work"
                              class="md-nav__link"
                            >
                              Preview your site as you work
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a href="#easy-to-customize" class="md-nav__link">
                              Easy to customize
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </li>

                    <li class="md-nav__item">
                      <a href="#installation" class="md-nav__link">
                        Installation
                      </a>

                      <nav class="md-nav" aria-label="Installation">
                        <ul class="md-nav__list">
                          <li class="md-nav__item">
                            <a
                              href="#install-with-a-package-manager"
                              class="md-nav__link"
                            >
                              Install with a Package Manager
                            </a>
                          </li>

                          <li class="md-nav__item">
                            <a href="#manual-installation" class="md-nav__link">
                              Manual Installation
                            </a>

                            <nav
                              class="md-nav"
                              aria-label="Manual Installation"
                            >
                              <ul class="md-nav__list">
                                <li class="md-nav__item">
                                  <a
                                    href="#installing-python"
                                    class="md-nav__link"
                                  >
                                    Installing Python
                                  </a>
                                </li>

                                <li class="md-nav__item">
                                  <a
                                    href="#installing-pip"
                                    class="md-nav__link"
                                  >
                                    Installing pip
                                  </a>
                                </li>

                                <li class="md-nav__item">
                                  <a
                                    href="#installing-mkdocs"
                                    class="md-nav__link"
                                  >
                                    Installing MkDocs
                                  </a>
                                </li>
                              </ul>
                            </nav>
                          </li>
                        </ul>
                      </nav>
                    </li>

                    <li class="md-nav__item">
                      <a href="#getting-started" class="md-nav__link">
                        Getting Started
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a href="#adding-pages" class="md-nav__link">
                        Adding pages
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a href="#theming-our-documentation" class="md-nav__link">
                        Theming our documentation
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a href="#changing-the-favicon-icon" class="md-nav__link">
                        Changing the Favicon Icon
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a href="#building-the-site" class="md-nav__link">
                        Building the site
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a
                        href="#other-commands-and-options"
                        class="md-nav__link"
                      >
                        Other Commands and Options
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a href="#deploying" class="md-nav__link">
                        Deploying
                      </a>
                    </li>

                    <li class="md-nav__item">
                      <a href="#getting-help" class="md-nav__link">
                        Getting help
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div class="md-content">
            <article class="md-content__inner md-typeset">
              <h1 id="mkdocs">
                MkDocs<a
                  class="headerlink"
                  href="#mkdocs"
                  title="Permanent link"
                  >&para;</a
                >
              </h1>
              <p>Project documentation with&nbsp;Markdown.</p>
              <hr />
              <h2 id="overview">
                Overview<a
                  class="headerlink"
                  href="#overview"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                MkDocs is a <strong>fast</strong>, <strong>simple</strong> and
                <strong>downright gorgeous</strong> static site generator that's
                geared towards building project documentation. Documentation
                source files are written in Markdown, and configured with a
                single YAML configuration file. Start by reading the
                introduction below, then check the User Guide for more info.
              </p>
              <h3 id="host-anywhere">
                Host anywhere<a
                  class="headerlink"
                  href="#host-anywhere"
                  title="Permanent link"
                  >&para;</a
                >
              </h3>
              <p>
                MkDocs builds completely static HTML sites that you can host on
                GitHub pages, Amazon S3, or
                <a href="user-guide/deploying-your-docs/">anywhere</a> else you
                choose.
              </p>
              <h3 id="great-themes-available">
                Great themes available<a
                  class="headerlink"
                  href="#great-themes-available"
                  title="Permanent link"
                  >&para;</a
                >
              </h3>
              <p>
                There's a stack of good looking
                <a href="user-guide/styling-your-docs/">themes</a> available for
                MkDocs. Choose between the built in themes:
                <a href="user-guide/styling-your-docs/#mkdocs">mkdocs</a> and
                <a href="user-guide/styling-your-docs/#readthedocs"
                  >readthedocs</a
                >, select one of the 3<sup>rd</sup> party themes listed on the
                <a href="https://github.com/mkdocs/mkdocs/wiki/MkDocs-Themes"
                  >MkDocs Themes</a
                >
                wiki page, or
                <a href="user-guide/custom-themes/">build your own</a>.
              </p>
              <h3 id="preview-your-site-as-you-work">
                Preview your site as you work<a
                  class="headerlink"
                  href="#preview-your-site-as-you-work"
                  title="Permanent link"
                  >&para;</a
                >
              </h3>
              <p>
                The built-in dev-server allows you to preview your documentation
                as you're writing it. It will even auto-reload and refresh your
                browser whenever you save your changes.
              </p>
              <h3 id="easy-to-customize">
                Easy to customize<a
                  class="headerlink"
                  href="#easy-to-customize"
                  title="Permanent link"
                  >&para;</a
                >
              </h3>
              <p>
                Get your project documentation looking just the way you want it
                by customizing the
                <a href="user-guide/configuration/#theme">theme</a> and/or
                installing some <a href="user-guide/plugins/">plugins</a>.
              </p>
              <hr />
              <h2 id="installation">
                Installation<a
                  class="headerlink"
                  href="#installation"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <h3 id="install-with-a-package-manager">
                Install with a Package Manager<a
                  class="headerlink"
                  href="#install-with-a-package-manager"
                  title="Permanent link"
                  >&para;</a
                >
              </h3>
              <p>
                If you have and use a package manager (such as
                <a href="https://help.ubuntu.com/community/AptGet/Howto"
                  >apt-get</a
                >,
                <a href="https://dnf.readthedocs.io/en/latest/index.html">dnf</a
                >, <a href="https://brew.sh/">homebrew</a>,
                <a href="http://yum.baseurl.org/">yum</a>,
                <a href="https://chocolatey.org/">chocolatey</a>, etc.) to
                install packages on your system, then you may want to search for
                a "MkDocs" package and, if a recent version is available,
                install it with your package manager (check your system's
                documentation for details). That's it, you're done! Skip down to
                <a href="#getting-started">Getting Started</a>.
              </p>
              <p>
                If your package manager does not have a recent "MkDocs" package,
                you can still use your package manager to install "Python" and
                "pip". Then you can use pip to
                <a href="#installing-mkdocs">install MkDocs</a>.
              </p>
              <h3 id="manual-installation">
                Manual Installation<a
                  class="headerlink"
                  href="#manual-installation"
                  title="Permanent link"
                  >&para;</a
                >
              </h3>
              <p>
                In order to manually install MkDocs you'll need
                <a href="https://www.python.org/">Python</a> installed on your
                system, as well as the Python package manager,
                <a href="https://pip.readthedocs.io/en/stable/installing/"
                  >pip</a
                >. You can check if you have these already installed from the
                command line:
              </p>
              <div class="highlight">
                <pre><span></span><code>$ python --version
Python <span class="m">3</span>.8.2
$ pip --version
pip <span class="m">20</span>.0.2 from /usr/local/lib/python3.8/site-packages/pip <span class="o">(</span>python <span class="m">3</span>.8<span class="o">)</span>
</code></pre>
              </div>

              <p>
                MkDocs supports Python versions 3.5, 3.6, 3.7, 3.8, and pypy3.
              </p>
              <h4 id="installing-python">
                Installing Python<a
                  class="headerlink"
                  href="#installing-python"
                  title="Permanent link"
                  >&para;</a
                >
              </h4>
              <p>
                Install <a href="https://www.python.org/">Python</a> by
                downloading an installer appropriate for your system from
                <a href="https://www.python.org/downloads/">python.org</a> and
                running it.
              </p>
              <div class="admonition note">
                <p class="admonition-title">Note</p>
                <p>
                  If you are installing Python on Windows, be sure to check the
                  box to have Python added to your PATH if the installer offers
                  such an option (it's normally off by default).
                </p>
                <p>
                  <img alt="Add Python to PATH" src="img/win-py-install.png" />
                </p>
              </div>
              <h4 id="installing-pip">
                Installing pip<a
                  class="headerlink"
                  href="#installing-pip"
                  title="Permanent link"
                  >&para;</a
                >
              </h4>
              <p>
                If you're using a recent version of Python, the Python package
                manager,
                <a href="https://pip.readthedocs.io/en/stable/installing/"
                  >pip</a
                >, is most likely installed by default. However, you may need to
                upgrade pip to the lasted version:
              </p>
              <div class="highlight">
                <pre><span></span><code>pip install --upgrade pip
</code></pre>
              </div>

              <p>
                If you need to install
                <a href="https://pip.readthedocs.io/en/stable/installing/"
                  >pip</a
                >
                for the first time, download
                <a href="https://bootstrap.pypa.io/get-pip.py">get-pip.py</a>.
                Then run the following command to install it:
              </p>
              <div class="highlight">
                <pre><span></span><code>python get-pip.py
</code></pre>
              </div>

              <h4 id="installing-mkdocs">
                Installing MkDocs<a
                  class="headerlink"
                  href="#installing-mkdocs"
                  title="Permanent link"
                  >&para;</a
                >
              </h4>
              <p>Install the <code>mkdocs</code> package using pip:</p>
              <div class="highlight">
                <pre><span></span><code>pip install mkdocs
</code></pre>
              </div>

              <p>
                You should now have the <code>mkdocs</code> command installed on
                your system. Run <code>mkdocs --version</code> to check that
                everything worked okay.
              </p>
              <div class="highlight">
                <pre><span></span><code>$ mkdocs --version
mkdocs, version <span class="m">0</span>.15.3
</code></pre>
              </div>

              <div class="admonition note">
                <p class="admonition-title">Note</p>
                <p>
                  If you would like manpages installed for MkDocs, the
                  <a href="https://github.com/click-contrib/click-man"
                    >click-man</a
                  >
                  tool can generate and install them for you. Simply run the
                  following two commands:
                </p>
                <table class="codehilitetable">
                  <tr>
                    <td class="linenos">
                      <div class="linenodiv">
                        <pre>
1
2</pre
                        >
                      </div>
                    </td>
                    <td class="code">
                      <div class="codehilite">
                        <pre><span></span><code>pip install click-man
click-man --target path/to/man/pages mkdocs
</code></pre>
                      </div>
                    </td>
                  </tr>
                </table>

                <p>
                  See the
                  <a
                    href="https://github.com/click-contrib/click-man#automatic-man-page-installation-with-setuptools-and-pip"
                    >click-man documentation</a
                  >
                  for an explanation of why manpages are not automatically
                  generated and installed by pip.
                </p>
              </div>
              <div class="admonition note">
                <p class="admonition-title">Note</p>
                <p>
                  If you are using Windows, some of the above commands may not
                  work out-of-the-box.
                </p>
                <p>
                  A quick solution may be to preface every Python command with
                  <code>python -m</code> like this:
                </p>
                <table class="codehilitetable">
                  <tr>
                    <td class="linenos">
                      <div class="linenodiv">
                        <pre>
1
2</pre
                        >
                      </div>
                    </td>
                    <td class="code">
                      <div class="codehilite">
                        <pre><span></span><code>python -m pip install mkdocs
python -m mkdocs
</code></pre>
                      </div>
                    </td>
                  </tr>
                </table>

                <p>
                  For a more permanent solution, you may need to edit your
                  <code>PATH</code> environment variable to include the
                  <code>Scripts</code> directory of your Python installation.
                  Recent versions of Python include a script to do this for you.
                  Navigate to your Python installation directory (for example
                  <code>C:\Python38\</code>), open the <code>Tools</code>, then
                  <code>Scripts</code> folder, and run the
                  <code>win_add2path.py</code> file by double clicking on it.
                  Alternatively, you can
                  <a
                    href="https://svn.python.org/projects/python/trunk/Tools/scripts/win_add2path.py"
                    >download</a
                  >
                  the script and run it (<code>python win_add2path.py</code>).
                </p>
              </div>
              <hr />
              <h2 id="getting-started">
                Getting Started<a
                  class="headerlink"
                  href="#getting-started"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>Getting started is super easy.</p>
              <div class="highlight">
                <pre><span></span><code>mkdocs new my-project
<span class="nb">cd</span> my-project
</code></pre>
              </div>

              <p>
                Take a moment to review the initial project that has been
                created for you.
              </p>
              <p>
                <img
                  alt="The initial MkDocs layout"
                  src="img/initial-layout.png"
                />
              </p>
              <p>
                There's a single configuration file named
                <code>mkdocs.yml</code>, and a folder named
                <code>docs</code> that will contain your documentation source
                files. Right now the <code>docs</code> folder just contains a
                single documentation page, named <code>index.md</code>.
              </p>
              <p>
                MkDocs comes with a built-in dev-server that lets you preview
                your documentation as you work on it. Make sure you're in the
                same directory as the <code>mkdocs.yml</code> configuration
                file, and then start the server by running the
                <code>mkdocs serve</code> command:
              </p>
              <div class="highlight">
                <pre><span></span><code>$ mkdocs serve
INFO    -  Building documentation...
INFO    -  Cleaning site directory
<span class="o">[</span>I <span class="m">160402</span> <span class="m">15</span>:50:43 server:271<span class="o">]</span> Serving on http://127.0.0.1:8000
<span class="o">[</span>I <span class="m">160402</span> <span class="m">15</span>:50:43 handlers:58<span class="o">]</span> Start watching changes
<span class="o">[</span>I <span class="m">160402</span> <span class="m">15</span>:50:43 handlers:60<span class="o">]</span> Start detecting changes
</code></pre>
              </div>

              <p>
                Open up <code>http://127.0.0.1:8000/</code> in your browser, and
                you'll see the default home page being displayed:
              </p>
              <p>
                <img alt="The MkDocs live server" src="img/screenshot.png" />
              </p>
              <p>
                The dev-server also supports auto-reloading, and will rebuild
                your documentation whenever anything in the configuration file,
                documentation directory, or theme directory changes.
              </p>
              <p>
                Open the <code>docs/index.md</code> document in your text editor
                of choice, change the initial heading to <code>MkLorum</code>,
                and save your changes. Your browser will auto-reload and you
                should see your updated documentation immediately.
              </p>
              <p>
                Now try editing the configuration file: <code>mkdocs.yml</code>.
                Change the
                <a href="user-guide/configuration/#site_name"
                  ><code>site_name</code></a
                >
                setting to <code>MkLorum</code> and save the file.
              </p>
              <div class="highlight">
                <pre><span></span><code><span class="nt">site_name</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">MkLorum</span>
</code></pre>
              </div>

              <p>
                Your browser should immediately reload, and you'll see your new
                site name take effect.
              </p>
              <p><img alt="The site_name setting" src="img/site-name.png" /></p>
              <h2 id="adding-pages">
                Adding pages<a
                  class="headerlink"
                  href="#adding-pages"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>Now add a second page to your documentation:</p>
              <div class="highlight">
                <pre><span></span><code>curl <span class="s1">&#39;https://jaspervdj.be/lorem-markdownum/markdown.txt&#39;</span> &gt; docs/about.md
</code></pre>
              </div>

              <p>
                As our documentation site will include some navigation headers,
                you may want to edit the configuration file and add some
                information about the order, title, and nesting of each page in
                the navigation header by adding a
                <a href="user-guide/configuration/#nav"><code>nav</code></a>
                setting:
              </p>
              <div class="highlight">
                <pre><span></span><code><span class="nt">site_name</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">MkLorum</span>
<span class="nt">nav</span><span class="p">:</span>
    <span class="p p-Indicator">-</span> <span class="nt">Home</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">index.md</span>
    <span class="p p-Indicator">-</span> <span class="nt">About</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">about.md</span>
</code></pre>
              </div>

              <p>
                Save your changes and you'll now see a navigation bar with
                <code>Home</code> and <code>About</code> items on the left as
                well as <code>Search</code>, <code>Previous</code>, and
                <code>Next</code> items on the right.
              </p>
              <p><img alt="Screenshot" src="img/multipage.png" /></p>
              <p>
                Try the menu items and navigate back and forth between pages.
                Then click on <code>Search</code>. A search dialog will appear,
                allowing you to search for any text on any page. Notice that the
                search results include every occurrence of the search term on
                the site and links directly to the section of the page in which
                the search term appears. You get all of that with no effort or
                configuration on your part!
              </p>
              <p><img alt="Screenshot" src="img/search.png" /></p>
              <h2 id="theming-our-documentation">
                Theming our documentation<a
                  class="headerlink"
                  href="#theming-our-documentation"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                Now change the configuration file to alter how the documentation
                is displayed by changing the theme. Edit the
                <code>mkdocs.yml</code> file and add a
                <a href="user-guide/configuration/#theme"><code>theme</code></a>
                setting:
              </p>
              <div class="highlight">
                <pre><span></span><code><span class="nt">site_name</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">MkLorum</span>
<span class="nt">nav</span><span class="p">:</span>
    <span class="p p-Indicator">-</span> <span class="nt">Home</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">index.md</span>
    <span class="p p-Indicator">-</span> <span class="nt">About</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">about.md</span>
<span class="nt">theme</span><span class="p">:</span> <span class="l l-Scalar l-Scalar-Plain">readthedocs</span>
</code></pre>
              </div>

              <p>
                Save your changes, and you'll see the ReadTheDocs theme being
                used.
              </p>
              <p><img alt="Screenshot" src="img/readthedocs.png" /></p>
              <h2 id="changing-the-favicon-icon">
                Changing the Favicon Icon<a
                  class="headerlink"
                  href="#changing-the-favicon-icon"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                By default, MkDocs uses the
                <a href="/img/favicon.ico">MkDocs favicon</a> icon. To use a
                different icon, create an <code>img</code> subdirectory in your
                <code>docs_dir</code> and copy your custom
                <code>favicon.ico</code> file to that directory. MkDocs will
                automatically detect and use that file as your favicon icon.
              </p>
              <h2 id="building-the-site">
                Building the site<a
                  class="headerlink"
                  href="#building-the-site"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                That's looking good. You're ready to deploy the first pass of
                your <code>MkLorum</code> documentation. First build the
                documentation:
              </p>
              <div class="highlight">
                <pre><span></span><code>mkdocs build
</code></pre>
              </div>

              <p>
                This will create a new directory, named <code>site</code>. Take
                a look inside the directory:
              </p>
              <div class="highlight">
                <pre><span></span><code>$ ls site
about  fonts  index.html  license  search.html
css    img    js          mkdocs   sitemap.xml
</code></pre>
              </div>

              <p>
                Notice that your source documentation has been output as two
                HTML files named <code>index.html</code> and
                <code>about/index.html</code>. You also have various other media
                that's been copied into the <code>site</code> directory as part
                of the documentation theme. You even have a
                <code>sitemap.xml</code> file and
                <code>mkdocs/search_index.json</code>.
              </p>
              <p>
                If you're using source code control such as <code>git</code> you
                probably don't want to check your documentation builds into the
                repository. Add a line containing <code>site/</code> to your
                <code>.gitignore</code> file.
              </p>
              <div class="highlight">
                <pre><span></span><code><span class="nb">echo</span> <span class="s2">&quot;site/&quot;</span> &gt;&gt; .gitignore
</code></pre>
              </div>

              <p>
                If you're using another source code control tool you'll want to
                check its documentation on how to ignore specific directories.
              </p>
              <p>
                After some time, files may be removed from the documentation but
                they will still reside in the <code>site</code> directory. To
                remove those stale files, just run <code>mkdocs</code> with the
                <code>--clean</code> switch.
              </p>
              <div class="highlight">
                <pre><span></span><code>mkdocs build --clean
</code></pre>
              </div>

              <h2 id="other-commands-and-options">
                Other Commands and Options<a
                  class="headerlink"
                  href="#other-commands-and-options"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                There are various other commands and options available. For a
                complete list of commands, use the <code>--help</code> flag:
              </p>
              <div class="highlight">
                <pre><span></span><code>mkdocs --help
</code></pre>
              </div>

              <p>
                To view a list of options available on a given command, use the
                <code>--help</code> flag with that command. For example, to get
                a list of all options available for the
                <code>build</code> command run the following:
              </p>
              <div class="highlight">
                <pre><span></span><code>mkdocs build --help
</code></pre>
              </div>

              <h2 id="deploying">
                Deploying<a
                  class="headerlink"
                  href="#deploying"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                The documentation site that you just built only uses static
                files so you'll be able to host it from pretty much anywhere.
                <a
                  href="https://help.github.com/articles/creating-project-pages-manually/"
                  >GitHub project pages</a
                >
                and
                <a
                  href="https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html"
                  >Amazon S3</a
                >
                may be good hosting options, depending upon your needs. Upload
                the contents of the entire <code>site</code> directory to
                wherever you're hosting your website from and you're done. For
                specific instructions on a number of common hosts, see the
                <a href="user-guide/deploying-your-docs/"
                  >Deploying your Docs</a
                >
                page.
              </p>
              <h2 id="getting-help">
                Getting help<a
                  class="headerlink"
                  href="#getting-help"
                  title="Permanent link"
                  >&para;</a
                >
              </h2>
              <p>
                To get help with MkDocs, please use the
                <a href="https://groups.google.com/forum/#!forum/mkdocs"
                  >discussion group</a
                >,
                <a href="https://github.com/mkdocs/mkdocs/issues"
                  >GitHub issues</a
                >
                or the MkDocs IRC channel <code>#mkdocs</code> on freenode.
              </p>
            </article>
          </div>
        </div>
      </main>

      <footer class="md-footer">
        <div class="md-footer-nav">
          <nav class="md-footer-nav__inner md-grid" aria-label="Footer">
            <a
              href="user-guide/writing-your-docs/"
              title="Writing Your Docs"
              class="md-footer-nav__link md-footer-nav__link--next"
              rel="next"
            >
              <div class="md-footer-nav__title">
                <div class="md-ellipsis">
                  <span class="md-footer-nav__direction">
                    Next
                  </span>
                  Writing Your Docs
                </div>
              </div>
              <div class="md-footer-nav__button md-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z"
                  />
                </svg>
              </div>
            </a>
          </nav>
        </div>

        <div class="md-footer-meta md-typeset">
          <div class="md-footer-meta__inner md-grid">
            <div class="md-footer-copyright">
              <div class="md-footer-copyright__highlight">
                Copyright &copy; 2014
                <a href="https://twitter.com/_tomchristie">Tom Christie</a>,
                Maintained by the
                <a href="/about/release-notes/#maintenance-team">MkDocs Team</a
                >.
              </div>

              Made with
              <a
                href="https://squidfunk.github.io/mkdocs-material/"
                target="_blank"
                rel="noopener"
              >
                Material for MkDocs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <script src="assets/javascripts/vendor.d710d30a.min.js"></script>
    <script src="assets/javascripts/bundle.7f4f3c92.min.js"></script>
    <script id="__lang" type="application/json">
      {
        "clipboard.copy": "Copy to clipboard",
        "clipboard.copied": "Copied to clipboard",
        "search.config.lang": "en",
        "search.config.pipeline": "trimmer, stopWordFilter",
        "search.config.separator": "[\\s\\-]+",
        "search.result.placeholder": "Type to start searching",
        "search.result.none": "No matching documents",
        "search.result.one": "1 matching document",
        "search.result.other": "# matching documents"
      }
    </script>

    <script>
      app = initialize({
        base: '.',
        features: [],
        search: Object.assign(
          {
            worker: 'assets/javascripts/worker/search.9b3611bd.min.js',
          },
          typeof search !== 'undefined' && search,
        ),
      });
    </script>
  </body>
</html>
`;
