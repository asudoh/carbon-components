# Transition to Storybook

## Goals

- Alignment of toolstack with other framework variants (React/Angular/Vue)
- Backward compatibilty (esp. distributed HTML); Though we know that the usage of distributed HTML is low, we cannot break it until next major release.
- Keep build fast

## Problems

- WebPack `sass-loader` is known to be slow with large number of imports

## Solutions

- Per-component Sass compilation in dev env
- `handlebars-loader`
- Storybook metadata: https://github.com/storybooks/storybook/issues/767#issuecomment-295121440

## Future

- React-based component HTML generation
