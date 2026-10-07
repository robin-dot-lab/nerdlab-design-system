// Toolbar menu of Candy's palettes, shown only while the Candy skin is selected: Bento has a single
// palette and ignores [data-palette] (ADR-030). The palette itself is a global of preview.tsx.
import { addons, types, useGlobals } from 'storybook/manager-api';
import { Select } from 'storybook/internal/components';
import palettes from '@robin-dot-lab/tokens/palettes.json';

function PaletteTool() {
  const [globals, updateGlobals] = useGlobals();
  if (globals.skin === 'bento') return null;
  const current = (globals.palette as string | undefined) ?? 'candy';
  return (
    <Select
      key={current}
      ariaLabel="Colour palette"
      size="small"
      padding="small"
      options={palettes.map((p) => ({ title: p.name, value: p.id }))}
      defaultOptions={current}
      onSelect={(value) => updateGlobals({ palette: value })}
    >
      Palette
    </Select>
  );
}

addons.register('nerdlab/palette', () => {
  addons.add('nerdlab/palette/tool', {
    type: types.TOOL,
    title: 'Palette',
    match: ({ viewMode, tabId }) => Boolean(viewMode?.match(/^(story|docs)$/)) && !tabId,
    render: () => <PaletteTool />,
  });
});
