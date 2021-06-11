---
id: migrating-from-v1alpha1-to-v1beta2
title: Migrating to v1beta2 templates
# prettier-ignore
description:
  How to move your old templates from v1alpha1 to the more declarative v1beta2
---

# What's new?

Previously, the scaffolder was very restricted in what you could do when
creating new software components from templates. There were three scaffolding
steps which was pretty hard to extend and add new functionality to, difficult to
re-use logic between templates. There used to be a fixed pipeline of
`preparers`, `templaters`, and `publishers`, which were defined by the backend
and needed to be run for each template. This is now changed, to give the
template total control over what should be executed as part of the templating
run. This makes templates a little more declarative as you can now register
different `actions` or `functions` with the `scaffolder-backend` which you then
can decide how, and in what order, to run using the template definition YAML
file.

We've also made some improvements, and added some helpers to work with
cookiecutter. The skeleton for a template can now be stored in a different place
to where your entity definition is: previously you needed to have your
`template.yaml` next to the skeleton source (`{{cookiecutter.component_id}}`
directory), but now that's not the case. Part of the changes with the `v1beta2`
syntax is that you can grab your template source from any repository, and re-use
them between templates.

We've also renamed the `schema` property to `parameters` as this makes more
sense when using them as parameters to the actions or steps that you've setup
for your templates. There's the added benefit that you can now assign an array
to the `parameters` property, which will then give you multiple steps in the UI,
so you can split apart your input parameters and group them as needed rather
than having one long list of input fields.

## The `parameters` property

The `schema` key has now been renamed to `parameters` with a few more features.
You can pass an array now to break apart the input form into different steps in
the UI. You can also specify `ui:schema` fields that are passed along to
[`react-jsonschema-form`](https://rjsf-team.github.io/react-jsonschema-form/)
inline with the JSON schema.

```yaml
spec:
  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the component
          ui:autofocus: true
          ui:options:
            rows: 5
```

## The `steps` property

`v1beta2` template syntax introduces the new `steps` property, which is an array
of `actions` that the scaffolder will run in combination with the user input
that is declared in the `schema`. Actions look like the following:

```yaml
spec:
  steps:
    - id: publish # a unique id for the step, can be anything you like
      name: Publish # a user friendly name for the step, this is what is shown in the frontend
      action: publish:github # the action ID that has been registered with the scaffolder-backend
      input: # parameters that are passed as input to the action handler function
        allowedHosts: ['github.com']
        description: 'This is {{ parameters.name }}' # handlebars templating is supported with the values from the parameters section in the same file.
        repoUrl: '{{ parameters.repoUrl }}'
```

# Migrating a `v1alpha1` template

## The template definition (.yaml)

### `parameters`

Because of the changes to invert the control to the `template.yaml` definition
for running the workflow, we need to adjust the `schema` property and we also
now need to define what the template is actually going to do as part of the
template run.

A simple migration would move the following yaml:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  name: react-ssr-template
  title: React SSR Template
  description: Create a website powered with Next.js
  tags:
    - recommended
    - react
spec:
  owner: web@example.com
  templater: cookiecutter
  type: website
  path: '.'
  schema:
    required:
      - component_id
      - description
    properties:
      component_id:
        title: Name
        type: string
        description: Unique name of the component
      description:
        title: Description
        type: string
        description: Help others understand what this website is for.
```

To something that looks like the following:

```yaml
apiVersion: backstage.io/v1beta2
kind: Template
metadata:
  name: react-ssr-template
  title: React SSR Template
  description: Create a website powered with Next.js
  tags:
    - recommended
    - react
spec:
  owner: web@example.com
  type: website
  parameters:
    - title: Add some input
      required:
        - component_id
        - description
      properties:
        component_id:
          title: Name
          type: string
          description: Unique name of the component
        description:
          title: Description
          type: string
          description: Help others understand what this website is for.
    - title: Some more additional info that was previously provided automatically
      required:
        - owner
        - repoUrl
      properties:
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            allowedKinds:
              - Group
            - title: Choose a location
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
```

There are a few things to note here. On the `alpha` version, the second step of
the template flow in the frontend was provided by Backstage for free, so we used
to collect the user input for the `owner` field and the `repositoryUrl` that you
were going to publish to. Now because `actions` can have any workflow they like,
it doesn't make sense to still provide these fields for every scaffolding
workflow, as you might not need these anymore. That's why we now manually add
those fields back into the template parameters that are shown to the user:

```yaml
    - title: Some more additional info that was previously provided automatically
      required:
        - owner
        - repoUrl
      properties:
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            allowedKinds:
              - Group
            - title: Choose a location
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
```

Maybe you also don't need to publish to `github.com`, you should replace this
with your VCS provider URL that is listed in your `integrations` config instead.

### `steps`

So now we should have all the required information that we need from the user in
a much more extensible way. We now need to tell the scaffolder what to do with
these parameters and what to do with the user input.

We've made templating using `cookiecutter` a little simpler. You don't need to
store the `cookiecutter` skeleton in the same directory as the `template.yaml`
definition, it can live wherever you like - maybe a shared repository somewhere
so you can re-use the skeletons but apply different actions for different
templates depending on your use case.

We also no longer need to have a directory called
`{{cookiecutter.component_id}}`. This is because now we can't ensure that
`component_id` will be a parameter that is provided from the frontend, this
could break `cookiecutter`. If your directory structure used to look like this:

```
my-awesome-template
  -> {{cookiecutter.component_id}}
    -> file.txt
    -> some_more_files.ts
  -> hooks
    -> post_gen_project.sh
  -> template.yaml
```

We now recommend that you move to the following structure:

```
my-awesome-template
  -> skeleton
    -> file.txt
    -> some_more_files.ts
  -> template.yaml
```

This migration renames the skeleton folder to something more semantic, and also
drops support for `cookiecutter` hooks. We've dropped support for `cookiecutter`
hooks for now, as hopefully everything that is stored in these hooks can be
moved to `actions` instead, and for security reasons, it's more secure to run
trusted code that you ship with Backstage as an action rather than some script
that can be pulled in from anywhere which doesn't get vetted first. It's a
pretty big security risk that those scripts will be run on Backstage instances
inside your infrastructure, especially `.sh` files.

If you really need hooks and can't find a suitable solution by using actions
please reach out to us through a ticket and we'll see what we can do to assist
:)

You'll notice that we removed the `templater` property from the `spec`
definition in the template `yaml`, so there's no way to define that this is a
`cookiecutter` `templater`.

We've created a built-in action that you can use which will when run, go grab a
directory from anywhere and run `cookiecutter` on top of it, and then extract
the contents into the working directory for the scaffolder.

Adding the `steps` for a simple template should look something like the
following:

```yaml
spec:
  steps:
    # this action will go use cookiecutter to template some files into the working directory
    - id: template # an ID for the templating step
      name: Create skeleton # A user friendly name for the action
      action: fetch:cookiecutter
      input:
        url: ./skeleton # this is the directory for your skeleton files.
                        # If it's located next to the `template.yaml` then you can use a relative path,
                        # otherwise you can use absolute URLs that point at the VCS: https://github.com/backstage/backstage/tree/master/some_folder_somewhere
        values:
          # for each value that you need to pass to cookiecutter, they should be listed here and set in this values object.
          # You can use the handlebars templating syntax to pull them from the input parameters listed in the same file
          name: '{{ parameters.name }}'
          owner: '{{ parameters.owner }}'
          destination: '{{ parseRepoUrl parameters.repoUrl }}'

      # this action is for publishing the working directory to the VCS
      - id: publish
        name: Publish
        action: publish:github
        input:
          allowedHosts: ['github.com']
          description: 'This is {{ parameters.name }}'
          repoUrl: '{{ parameters.repoUrl }}'

      # this action will then register the created component in Backstage
      - id: register
        name: Register
        action: catalog:register
        input:
          repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
          catalogInfoPath: '/catalog-info.yaml'
```

### `output`

Steps can output values, and so can the template itself. This is good for
returning values to the frontend, so we can make the buttons like
`Go to catalog` and `Go to repo` work correctly. You can add the following to
your `template.yaml` to make sure you return the right values from the steps:

```yaml
spec:
  output:
    remoteUrl: '{{ steps.publish.output.remoteUrl }}'
    entityRef: '{{ steps.register.output.entityRef }}'
```

Or you can return a `links` array with text and a URL explicitly:

```yaml
spec:
  output:
    links:
      - url: '{{steps.publish.output.remoteUrl}}'
        text: 'Go to Repo'
```

## Questions?

If you have any questions or feedback, please reach out to us on GitHub or
Discord and we will do our best to help!
