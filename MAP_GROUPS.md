Design and plan a feature to support optional map grouping in the application.

Maps should support a new field `group_code: string | null`. Grouping is implemented by assigning the same `group_code` to multiple maps. Maps with the same `group_code` belong to the same group, while maps with `group_code = null` remain independent. No additional database tables should be introduced.

On the frontend, maps must be grouped using `group_code` as the key. If `group_code` is null, use the map’s own `id` as a fallback so it behaves as a single-item group. This ensures grouping is optional and does not affect existing behavior.

All user-facing texts in the app must be written in Brazilian Portuguese (pt-BR).

### Map List Screen (Main Screen)

- Add a "Selecionar" button in the header.
- When activated:
    - Display checkboxes on each map item that does NOT have a `group_code`.
    - Allow selecting multiple maps.
    - If more than one map is selected, enable grouping.

- While in selection mode:
    - Hide default left/right header buttons.
    - Show:
        - Left: “Cancelar”
        - Right: “Agrupar”

    - Follow Expo Router (SDK 55) header patterns for dynamic header updates (android and ios).

- When grouping is confirmed:
    - Generate a hash `group_code` and assign it to all selected maps (use toHex() util).

### Grouped Map Rendering

- Maps with the same `group_code` should be rendered as a single grouped component.
- The UI should indicate it is a group (e.g., “X mapas”).

### Map Details Screen

Behavior depends on type:

**Single Map**

- Keep existing behavior.

**Grouped Maps**

- Show a list of maps in the group.

- Tapping a map opens the normal map detail screen.

- Allow editing the group:
    - Remove maps (set `group_code = null`)
    - Add maps:
        - Open a modal
        - List only maps with `group_code = null`
        - Filter by current selected city
        - Show only name and address

- Enforce rule:
    - A group must always contain at least 2 maps
    - If reduced to 1, automatically remove grouping (`group_code = null`) and go back

### Assignment Logic

- Update assignment logic to accept an array of maps instead of a single map.
- When assigning a grouped map:
    - Assign all maps in the group to the publisher.

### Publisher View

- On the publisher’s home screen:
    - Display maps grouped by `group_code` (same logic as main screen)

- On interaction:
    - Tapping a group opens a group view screen
    - Tapping a map inside the group opens the map detail screen

### Constraints

- Do not create new database tables
- Keep the implementation simple and scalable
- Ensure backward compatibility with existing maps
- Use hash for `group_code` with toHex() util function

---
