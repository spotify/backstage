/*
 * Copyright 2021 Spotify AB
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

module.exports={
  "title": "Backstage Service Catalog and Developer Platform",
  "tagline": "An open platform for building developer portals",
  "url": "https://backstage.io",
  "baseUrl": "/",
  "organizationName": "Spotify",
  "projectName": "backstage",
  "scripts": [
    "https://buttons.github.io/buttons.js",
    "https://unpkg.com/medium-zoom@1.0.6/dist/medium-zoom.min.js",
    "/js/medium-zoom.js",
    "/js/dismissable-banner.js",
    "/js/scroll-nav-to-view-in-docs.js"
  ],
  "stylesheets": [
    "https://fonts.googleapis.com/css?family=IBM+Plex+Mono:500,700&display=swap"
  ],
  "favicon": "img/favicon.ico",
  "customFields": {
    "fossWebsite": "https://spotify.github.io/",
    "repoUrl": "https://github.com/backstage/backstage"
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "homePageId": "overview/what-is-backstage",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "editUrl": "https://github.com/backstage/backstage/edit/master/docs/",
          "path": "../docs",
          "sidebarPath": "./sidebars.json"
        },
        "blog": {
          "path": "blog"
        },
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "Backstage Service Catalog and Developer Platform",
      "items": [
        {
          "href": "https://github.com/backstage/backstage",
          "label": "GitHub",
          "position": "left"
        },
        {
          "to": "docs/",
          "label": "Docs",
          "position": "left"
        },
        {
          "to": "/plugins",
          "label": "Plugins",
          "position": "left"
        },
        {
          "to": "/blog",
          "label": "Blog",
          "position": "left"
        },
        {
          "to": "/demos",
          "label": "Demos",
          "position": "left"
        },
        {
          "href": "https://mailchi.mp/spotify/backstage-community",
          "label": "Newsletter",
          "position": "left"
        }
      ]
    },
    "image": "img/sharing-opengraph.png",
    "footer": {
      "links": [
        {
          "title": "Community",
          "items": [
            {
              "label": "Twitter",
              "to": "https://twitter.com/SpotifyEng"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2021 Backstage Project Authors. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page: https://www.linuxfoundation.org/trademark-usage",
      "logo": {
        "src": "img/android-chrome-192x192.png"
      }
    },
    "algolia": {
      "apiKey": "8d115c9875ba0f4feaee95bab55a1645",
      "indexName": "backstage",
      "searchParameters": {}
    },
    "gtag": {
      "trackingID": "UA-163836834-5"
    }
  }
}
