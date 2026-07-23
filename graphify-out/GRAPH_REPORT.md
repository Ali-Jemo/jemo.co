# Graph Report - .  (2026-07-22)

## Corpus Check
- Corpus is ~24,286 words - fits in a single context window. You may not need a graph.

## Summary
- 74 nodes · 58 edges · 5 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `init()` - 9 edges
2. `POST()` - 6 edges
3. `supabaseAdmin()` - 6 edges
4. `POST()` - 4 edges
5. `GET()` - 3 edges
6. `initStickyHeader()` - 2 edges
7. `initButtonPress()` - 2 edges
8. `initScrollReveal()` - 2 edges
9. `initHeroEntrance()` - 2 edges
10. `initGlowLine()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `supabaseAdmin()`  [INFERRED]
  src/app/api/admin/update-status/route.ts → src/lib/supabase.ts
- `POST()` --calls--> `supabaseAdmin()`  [INFERRED]
  src/app/api/track/route.ts → src/lib/supabase.ts
- `POST()` --calls--> `supabaseAdmin()`  [INFERRED]
  src/app/api/telegram/webhook/route.ts → src/lib/supabase.ts
- `GET()` --calls--> `supabaseAdmin()`  [INFERRED]
  src/app/api/public/applications/route.ts → src/lib/supabase.ts
- `POST()` --calls--> `supabaseAdmin()`  [INFERRED]
  src/app/api/applications/route.ts → src/lib/supabase.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (7): GET(), POST(), sendNewSubmissionTelegramAlert(), sendSubmissionConfirmationEmail(), supabaseAdmin(), POST(), POST()

### Community 1 - "Community 1"
Cohesion: 0.38
Nodes (9): init(), initButtonPress(), initGlowLine(), initHeroEntrance(), initNavGlow(), initParticles(), initScrollReveal(), initSmoothScroll() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.6
Nodes (5): generateContractId(), notifyTelegramBot(), POST(), sendAcceptanceEmail(), sendRejectionEmail()

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (2): handleSubmit(), validate()

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): generateJoinDocumentPDF(), getDeptChannel()

## Knowledge Gaps
- **Thin community `Community 3`** (4 nodes): `handleChange()`, `handleSubmit()`, `validate()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (3 nodes): `generateJoinDocumentPDF()`, `getDeptChannel()`, `pdf-generator.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `supabaseAdmin()` connect `Community 0` to `Community 2`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `supabaseAdmin()` (e.g. with `POST()` and `GET()`) actually correct?**
  _`supabaseAdmin()` has 5 INFERRED edges - model-reasoned connections that need verification._