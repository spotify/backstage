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

import React from 'react';
import { MarkdownContent } from './MarkdownContent';

export default {
  title: 'Data Display/MarkdownContent',
  component: MarkdownContent,
};

const markdownGithubFlavored =
  '# GFM\n' +
  '\n' +
  '## Autolink literals\n' +
  '\n' +
  'www.example.com, https://example.com, and contact@example.com.\n' +
  '\n' +
  '## Strikethrough\n' +
  '\n' +
  '~one~ or ~~two~~ tildes.\n' +
  '\n' +
  '## Table\n' +
  '\n' +
  '| foo | bar |\n' +
  '| --- | --- |\n' +
  '| baz | bim |\n' +
  '| buz | bum |\n' +
  '| biz | bim |\n' +
  '\n' +
  '## Tasklist\n' +
  '\n' +
  '* [ ] to do\n' +
  '* [x] done';

const markdown =
  '# Choreas Iovis\n' +
  '\n' +
  '## Incedere retenta\n' +
  '\n' +
  'Lorem markdownum velamina [nupta amici aequoreis](http://est-quae.org/sic)\n' +
  'desertum factum premunt: falcato parvos nihil. Facietque vulnus tum dumque\n' +
  'reserato Maeandros insignia solidis, tot longi causa et nimium arcuerat altera\n' +
  'unus, in quis.\n' +
  '\n' +
  '1. Est qui dixere nullus\n' +
  '2. Fuit obicit\n' +
  '3. Vim patrem portae materiem ulla quod crater\n' +
  '4. Rigido est magis raptor quid crepitante aequa\n' +
  '5. Imago quis ignis tamen\n' +
  '\n' +
  '## Vix posse vestem\n' +
  '\n' +
  'Nec deos robora visa pater toris remittit *crimina* utque, ora ego lacerae quae\n' +
  'laboris laturus silvas audax terrae. Qua fuisse patrio inlaesas [sine\n' +
  'seque](http://ambitvictore.org/), nondum et tamen annis, nec. Poscimur magnum,\n' +
  'Hesperium dedisti, ait ipse et fides terras scalas.\n' +
  '\n' +
  '- Quas superis satyri adloquitur natura hausimus\n' +
  '- Dux suspicere siccare\n' +
  '- Cape huc quid videor\n' +
  '- Foret vivit concolor\n' +
  '- Occupat morte oblectamina minuunt quaeque placidis nate\n' +
  '- Non posset' +
  '\n' +
  'Licet movitque dederat potest in sorores in sola pendere luce pro quod, sit.\n' +
  'Inpia ut in opibus flores uno quam quo multifidasque fera anhelitus retorsit.\n' +
  'Sustinui premebat puppe somnos. Dicit genu sic qualia excussit facunde parvae in\n' +
  'robur, Ianthe Interea. Superis victorque ponat puta cum: est enim.\n' +
  '\n' +
  '## Tacetve est in nullis Cerberus silvani luminibus\n' +
  '\n' +
  'Divulsere *summissoque esse manes*; artus ausus conatoque utque: illo\n' +
  'Phaestiadas quod pascat et referentem, nec. In seris, iubebat iam nomina:\n' +
  'tergoque occidit ingenii.\n' +
  '\n' +
  '    mouseDdl(tablet_definition * phishing_icann_mamp);\n' +
  '    vector += 20 + key_ram.source_isa(hard_tunneling_zone(w_wireless_page));\n' +
  '    if (rate_client_direct) {\n' +
  '        textXDpi += sql_cloud_class.sdk.speakers_wired_warm(pcZettabyteGis(\n' +
  '                market_bezel, 1), 1);\n' +
  '        tag_scraping = format_ppi;\n' +
  '    }\n' +
  '\n' +
  'Per quem, nec formosior qui cum Peliden me interea **ornatos**! Te facit\n' +
  'instimulat sequentia in flumina exilium te vulnere, sola. Coetum nec amnes.\n' +
  'Protinus nam Caras cava, *a* vocantem dicta inevitabile, nata nulla.\n' +
  '\n' +
  '## Piscem Iunoni maius\n' +
  '\n' +
  'Prece fallere arduus, *ad Athamantis laticem* simillima in ante Temesesque opus!\n' +
  'Ausim quoslibet crede Tyria: Medusa [muneris Aeneaden\n' +
  'tutaque](http://cragon-aequoribus.io/) genitor fistula cogeris abstrahere nati,\n' +
  'relevare videri *non*.\n' +
  '\n' +
  '> Promissas ulterius senectae Desinet his ait pedum! Libet *sublime* vibrantia\n' +
  '> si *dicta quod* pectora cupidine hastam dominoque.\n' +
  '\n' +
  'Pedis hic, est bis quod, adhaeret et reditum. Fixa sic vel pugnare **forte est**\n' +
  'parte in quaerite generisque repugnat; de quod, creatos.';
export const MarkdownContentCommonMark = () => (
  <MarkdownContent content={markdown} dialect="common-mark" />
);

export const MarkdownContentGithubFlavoredCommonMark = () => (
  <MarkdownContent content={markdownGithubFlavored} dialect="gfm" />
);
