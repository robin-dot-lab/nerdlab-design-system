import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Field, Input, Radio, RadioGroup, Select, Textarea } from '@nerdlab/react';

const meta = {
  title: 'Composants/Formulaires',
  component: RadioGroup,
  subcomponents: { Radio, Select, Textarea },
} satisfies Meta<typeof RadioGroup>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** `<select>` natif : sélecteur du système sur mobile, saisie au clavier, envoi avec le formulaire. */
export const SelectField: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Field label="Ville" help="Là où tu viendras.">
        <Select defaultValue="lyon">
          <option value="lyon">Lyon</option>
          <option value="paris">Paris</option>
          <option value="nantes">Nantes</option>
        </Select>
      </Field>
    </div>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 420 }}>
      <Field label="Message"><Textarea placeholder="Une question sur l’atelier ?" /></Field>
      <Field label="Bio" error="300 caractères au plus."><Textarea defaultValue="Pixel artist, shader nerd…" /></Field>
    </div>
  ),
};

/** Radios natifs dans un `<fieldset>` : les flèches déplacent la sélection, la légende nomme le groupe. */
export const Radios: Story = {
  render: () => (
    <div className="nl-stack nl-gap-6">
      <RadioGroup legend="Format d’export" defaultValue="csv">
        <Radio value="csv">CSV</Radio>
        <Radio value="json">JSON</Radio>
        <Radio value="xlsx" disabled>Excel (bientôt)</Radio>
      </RadioGroup>
      <RadioGroup legend="Taille du t-shirt" orientation="horizontal" error="Choisis une taille.">
        {['S', 'M', 'L', 'XL'].map((s) => <Radio key={s} value={s}>{s}</Radio>)}
      </RadioGroup>
    </div>
  ),
};

export const FullForm: Story = {
  render: () => (
    <form className="nl-stack" style={{ maxWidth: 420 }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Nom"><Input placeholder="Ada Lovelace" /></Field>
      <Field label="Atelier"><Select defaultValue="shader"><option value="shader">Shader</option><option value="pixel">Pixel art</option></Select></Field>
      <RadioGroup legend="Niveau" defaultValue="debutant" orientation="horizontal">
        <Radio value="debutant">Débutant</Radio>
        <Radio value="confirme">Confirmé</Radio>
      </RadioGroup>
      <Field label="Commentaire"><Textarea /></Field>
      <div><Button type="submit" variant="primary">S’inscrire</Button></div>
    </form>
  ),
};
