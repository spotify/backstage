# Frontend with NGINX

This folder contains Docker images that let you run the Backstage frontend as
a separate image, rather than having it served through the `app-backend` plugin
from the backend.

Note that when running the frontend like this, the app configuration becomes
embedded into the actual static JavaScript files at build time. This means that
you will have to supply the list of configuration files as part of the command
line at build.

## Usage

There are two variants: one that builds inside Docker, and one that builds on
the host. See the comments at the top of the individual dockerfiles for usage
instructions.
