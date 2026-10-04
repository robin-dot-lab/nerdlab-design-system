import type { Meta, StoryObj } from '@storybook/react-vite';
import { Band, Button, Cluster, Container, MobileNav, SiteFooter, SiteHeader, Stack, Sticker } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Site pages',
  component: SiteHeader,
  subcomponents: { SiteFooter, Band },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj;

const links = [<a key="how" href="#how">How it works</a>, <a key="faq" href="#faq">FAQ</a>, <a key="terms" href="#">Terms</a>];

/** A public page: header, a hero band on grid paper, a feature band, a final call, the footer. */
export const HomePage: Story = {
  render: () => (
    <>
      <SiteHeader
        brand={<a href="#">NERDLAB MAIL</a>}
        nav={links}
        navLabel="Site"
        actions={<><Button size="sm" variant="ghost">Sign in</Button><Button size="sm" variant="primary">Get an address</Button></>}
        mobileNav={<MobileNav label="Menu">{links}</MobileNav>}
      />
      <main>
        <Band tone="paper">
          <Container>
            <Cluster gap={6} justify="between">
              <Stack gap={4}>
                <h1 className="nl-display nl-display--xl">An address in one click</h1>
                <p>Disposable inboxes that expire on their own.</p>
                <Cluster gap={3}><Button variant="primary" size="lg">Create an address</Button></Cluster>
              </Stack>
              <Sticker tone="accent">Free</Sticker>
            </Cluster>
          </Container>
        </Band>
        <Band id="how">
          <Container>
            <Stack gap={3}>
              <h2 className="nl-headline nl-headline--lg">How it works</h2>
              <p>Pick an address, use it, let it expire.</p>
            </Stack>
          </Container>
        </Band>
        <Band tone="accent">
          <Container>
            <Cluster gap={4} justify="between">
              <h2 className="nl-headline nl-headline--md">Ready when you are.</h2>
              <Button>Start now</Button>
            </Cluster>
          </Container>
        </Band>
      </main>
      <SiteFooter legal={<p>© 2026 Nerdlab · <a href="#">Terms</a> · <a href="#">Privacy</a></p>}>
        <p className="nl-headline nl-headline--md">Nerdlab Mail</p>
      </SiteFooter>
    </>
  ),
};

/** The tones of a band. */
export const BandTones: Story = {
  render: () => (
    <>
      {(['background', 'surface', 'paper', 'accent', 'primary', 'ink'] as const).map((tone) => (
        <Band key={tone} tone={tone}><Container><p className="nl-headline nl-headline--sm">{tone}</p></Container></Band>
      ))}
    </>
  ),
};
