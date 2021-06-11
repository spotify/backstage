---
id: catalog-customization
title: Catalog Customization
# prettier-ignore
description: How to add custom filters or interface elements to the Backstage software catalog
---

The Backstage software catalog comes with a default `CatalogIndexPage` to filter
and find catalog entities. This is already set up by default by
`@backstage/create-app`.

If you want to change the default index page - such as to add a custom filter to
the catalog - you can replace the routing in `App.tsx` to point to your own
`CatalogIndexPage`.

> Note: The catalog index page is designed to have a minimal code footprint to
> support easy customization, but creating a copy does introduce a possibility
> of drifting out of date over time. Be sure to check the catalog
> [CHANGELOG](https://github.com/backstage/backstage/blob/master/plugins/catalog/CHANGELOG.md)
> periodically.

For example, suppose that I want to allow filtering by a custom annotation added
to entities, `company.com/security-tier`. To start, I'll copy the code for the
default catalog page and create a component in a
[new plugin](../../plugins/create-a-plugin.md):

```tsx
// imports, etc omitted for brevity. for full source see:
// https://github.com/backstage/backstage/blob/master/plugins/catalog/src/components/CatalogPage/CatalogPage.tsx
export const CustomCatalogPage = () => {
  return (
    <CatalogLayout>
      <Content>
        <ContentHeader title="Components">
          <CreateComponentButton />
          <SupportButton>All your software catalog entities</SupportButton>
        </ContentHeader>
        <div className={styles.contentWrapper}>
          <EntityListProvider>
            <div>
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker />
              <EntityTagPicker />
            </div>
            <CatalogTable />
          </EntityListProvider>
        </div>
      </Content>
    </CatalogLayout>
  );
};
```

The `EntityListProvider` shown here provides a list of entities from the
`catalog-backend`, and a way to hook in filters.

Now we're ready to create a new filter that implements the `EntityFilter`
interface:

```ts
import { EntityFilter } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

class EntitySecurityTierFilter implements EntityFilter {
  constructor(readonly values: string[]) {}
  filterEntity(entity: Entity): boolean {
    const tier = entity.metadata.annotations?.['company.com/security-tier'];
    return tier !== undefined && this.values.includes(tier);
  }
}
```

The `EntityFilter` interface permits backend filters, which are passed along to
the `catalog-backend` - or frontend filters, which are applied after entities
are loaded from the backend.

We'll use this filter to extend the default filters in a type-safe way. Let's
create the custom filter shape extending the default somewhere alongside this
filter:

```ts
export type CustomFilters = DefaultEntityFilters & {
  securityTiers?: EntitySecurityTierFilter;
};
```

To control this filter, we can create a React component that shows checkboxes
for the security tiers. This component will make use of the
`useEntityListProvider` hook, which accepts this extended filter type as a
[generic](https://www.typescriptlang.org/docs/handbook/2/generics.html)
parameter:

```tsx
export const EntitySecurityTierPicker = () => {
  // The securityTiers key is recognized due to the CustomFilter generic
  const {
    filters: { securityTiers },
    updateFilters,
  } = useEntityListProvider<CustomFilters>();

  // Toggles the value, depending on whether it's already selected
  function onChange(value: string) {
    const newTiers = securityTiers?.values.includes(value)
      ? securityTiers.values.filter(tier => tier !== value)
      : [...(securityTiers?.values ?? []), value];
    updateFilters({
      securityTiers: newTiers.length
        ? new EntitySecurityTierFilter(newTiers)
        : undefined,
    });
  }

  const tierOptions = ['1', '2', '3'];
  return (
    <FormControl component="fieldset">
      <Typography variant="button">Security Tier</Typography>
      <FormGroup>
        {tierOptions.map(tier => (
          <FormControlLabel
            key={tier}
            control={
              <Checkbox
                checked={securityTiers?.values.includes(tier)}
                onChange={() => onChange(tier)}
              />
            }
            label={`Tier ${tier}`}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
```

Now we can add the component to `CustomCatalogPage`:

```diff
export const CustomCatalogPage = () => {
  return (
    ...
          <EntityListProvider>
            <div>
              <EntityKindPicker initialFilter="component" hidden />
              <EntityTypePicker />
              <UserListPicker />
+              <EntitySecurityTierPicker />
              <EntityTagPicker />
            </div>
            <CatalogTable />
          </EntityListProvider>
    ...
};
```

This page itself can be exported as a routable extension in the plugin:

```ts
export const CustomCatalogIndexPage = myPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/CustomCatalogPage').then(m => m.CustomCatalogPage),
    mountPoint: catalogRouteRef,
  }),
);
```

Finally, we can replace the catalog route in the Backstage application with our
new `CustomCatalogIndexPage`.

```diff
# packages/app/src/App.tsx
const routes = (
  <FlatRoutes>
    <Navigate key="/" to="/catalog" />
-    <Route path="/catalog" element={<CatalogIndexPage />} />
+    <Route path="/catalog" element={<CustomCatalogIndexPage />} />
```

The same method can be used to customize the _default_ filters with a different
interface - for such usage, the generic argument isn't needed since the filter
shape remains the same as the default.
