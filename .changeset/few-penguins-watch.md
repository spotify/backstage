---
'@backstage/plugin-catalog-import': patch
---

Add initial support for customizing the catalog import page.

It is now possible to pass a custom layout to the import page, as it's already
supported by the search page. If no custom layout is passed, the default layout
is used.

```typescript
<Route path="/catalog-import" element={<CatalogImportPage />}>
  <Page themeId="home">
    <Header title="Register an existing component" />
    <Content>
      <ContentHeader title="Start tracking your components">
        <SupportButton>
          Start tracking your component in Backstage by adding it to the
          software catalog.
        </SupportButton>
      </ContentHeader>

      <Grid container spacing={2} direction="row-reverse">
        <Grid item xs={12} md={4} lg={6} xl={8}>
          Hello World
        </Grid>

        <Grid item xs={12} md={8} lg={6} xl={4}>
          <ImportStepper />
        </Grid>
      </Grid>
    </Content>
  </Page>
</Route>
```
