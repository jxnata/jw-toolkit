# E01 — Agrupamento de Mapas

## Contexto

Os mapas atualmente são exibidos e designados individualmente. A feature adiciona suporte a agrupamento opcional: múltiplos mapas compartilham um `group_code` e são tratados como uma única unidade de designação. O campo `group_code` já existe no schema do InstantDB (string opcional, indexado). Mapas com `group_code = null` continuam funcionando normalmente.

## Escopo

- Operações de serviço para definir/remover `group_code` nos mapas
- Lógica de agrupamento nos hooks (`group_code` ou `id` como chave)
- Componente visual de grupo (`MapGroupItem`) com indicador "X mapas"
- Modo de seleção na tela de lista (admin): "Selecionar" → checkboxes → "Agrupar"
- Renderização agrupada na lista de mapas (admin)
- Tela de detalhe do grupo: listar mapas, remover/adicionar, regra de mínimo 2
- Designação em lote: atribuir todos os mapas do grupo ao publicador
- Visão do publicador: lista agrupada + tela de detalhe do grupo

## Decisões-chave

- `group_code` gerado via `toHex(Date.now() + Math.random())` — sem nova tabela
- Agrupamento apenas no frontend, usando `group_code` como chave
- Mapas com `group_code = null` usam `id` como fallback (grupo de 1, sem checkbox)
- Regra: grupo deve ter ≥ 2 mapas — se restar 1, limpar `group_code` automaticamente
- Designar grupo = designar todos os mapas do grupo via `Promise.all`

## Referências

- `src/services/instantdb/maps-service.ts` — serviço de mapas
- `src/hooks/use-maps.ts` — hook principal de listagem
- `src/components/map-item.tsx` — componente atual de item de mapa
- `src/app/(app)/admin/maps/index.tsx` — tela de lista (admin)
- `src/app/(app)/admin/maps/[id]/index.tsx` — tela de detalhe (admin)
- `src/app/(app)/publisher/index.tsx` — home do publicador
- `src/utils/to-hex.ts` — utilitário para gerar hash do group_code
