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

// *** Cobertura ***
export type CoberturaXML = {
  coverage: Coverage;
};

export type Coverage = {
  packages: Array<Package>;
  package: Array<InnerPackage>;
};

export type Package = {
  package: Array<InnerPackage>;
};

export type InnerPackage = {
  classes: Array<Class>;
};
export type Class = {
  class: Array<InnerClass>;
};
export type InnerClass = {
  $: {
    filename: string;
  };
  lines: Array<Line>;
  methods: Array<Method>;
};
export type Method = {
  method: Array<InnerMethod>;
};
export type InnerMethod = {
  lines: Array<Line>;
};
export type Line = {
  line: Array<InnerLine>;
};

export type InnerLine = {
  $: LineHit;
};

export type LineHit = {
  branch?: boolean;
  'condition-coverage'?: string;
  number: number;
  hits: number;
};

// *** Jacoco ***
export type JacocoXML = {
  report: JacocoReport;
};
export type JacocoReport = {
  package: JacocoPackage[];
};
export type JacocoPackage = {
  $: {
    name: string;
  };
  sourcefile: JacocoSourceFile[];
};
export type JacocoSourceFile = {
  $: {
    name: string;
  };
  line: JacocoLine[];
};
export type JacocoLine = {
  $: {
    nr: string;
    mi: string;
    ci: string;
    mb: string;
    cb: string;
  };
};
