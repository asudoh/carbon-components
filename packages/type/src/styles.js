/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { px, rem } from '@carbon/layout';
import { fontWeights } from './fontWeight';
import { fontFamilies } from './fontFamily';
import { scale } from './scale';

export const caption01 = {
  fontSize: rem(scale[0]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(16),
  letterSpacing: px(0.32),
};

export const productiveCaption01 = caption01;

export const expressiveCaption01 = {
  ...caption01,
  fontSize: rem(scale[1]),
  lineHeight: rem(18),
  letterSpacing: px(0.16),
};

export const label01 = {
  fontSize: rem(scale[0]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(16),
  letterSpacing: px(0.32),
};

export const productiveLabel01 = label01;

export const expressiveLabel01 = {
  ...label01,
  fontSize: rem(scale[1]),
  lineHeight: rem(18),
  letterSpacing: px(0.16),
};

export const helperText01 = {
  fontSize: rem(scale[0]),
  lineHeight: rem(16),
  letterSpacing: px(0.32),
};

export const productiveHelperText01 = helperText01;

export const expressiveHelperText01 = {
  ...helperText01,
  fontSize: rem(scale[1]),
  lineHeight: rem(18),
  letterSpacing: px(0.16),
};

export const bodyShort01 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(18),
  letterSpacing: px(0.16),
};

export const productiveBodyShort01 = bodyShort01;

export const expressiveBodyShort01 = {
  ...bodyShort01,
  fontSize: rem(scale[2]),
  lineHeight: rem(22),
  letterSpacing: 0,
};

export const bodyLong01 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(20),
  letterSpacing: px(0.16),
};

export const productiveBodyLong01 = bodyLong01;

export const expressiveBodyLong01 = {
  ...bodyLong01,
  fontSize: rem(scale[2]),
  lineHeight: rem(24),
  letterSpacing: 0,
};

export const bodyShort02 = {
  fontSize: rem(scale[2]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(22),
  letterSpacing: 0,
};

export const productiveBodyShort02 = bodyShort02;
export const expressiveBodyShort02 = bodyShort02;

export const bodyLong02 = {
  fontSize: rem(scale[2]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(24),
  letterSpacing: 0,
};

export const productiveBodyLong02 = bodyLong02;
export const expressiveBodyLong02 = bodyLong02;

export const code01 = {
  fontFamily: fontFamilies.mono,
  fontSize: rem(scale[0]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(16),
  letterSpacing: px(0.32),
};

export const productiveCode01 = code01;

export const expressiveCode01 = {
  ...code01,
  fontSize: rem(scale[1]),
  lineHeight: rem(20),
  letterSpacing: 0,
};

export const code02 = {
  fontFamily: fontFamilies.mono,
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(20),
  letterSpacing: px(0.32),
};

export const productiveCode02 = code02;

export const expressiveCode02 = {
  ...code02,
  fontSize: rem(scale[2]),
  lineHeight: rem(24),
  letterSpacing: 0,
};

export const heading01 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.semibold,
  lineHeight: rem(18),
  letterSpacing: px(0.16),
};

export const productiveHeading01 = heading01;

export const heading02 = {
  fontSize: rem(scale[2]),
  fontWeight: fontWeights.semibold,
  lineHeight: rem(22),
  letterSpacing: 0,
};

export const productiveHeading02 = heading02;

export const heading03 = {
  fontSize: rem(scale[4]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(26),
  letterSpacing: 0,
};

export const productiveHeading03 = heading03;

export const heading04 = {
  fontSize: rem(scale[6]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(36),
  letterSpacing: 0,
};

export const productiveHeading04 = heading04;

export const heading05 = {
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(40),
  letterSpacing: 0,
};

export const productiveHeading05 = heading05;

export const heading06 = {
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.light,
  lineHeight: rem(50),
  letterSpacing: 0,
};

export const productiveHeading06 = heading06;

export const heading07 = {
  fontSize: rem(scale[11]),
  fontWeight: fontWeights.light,
  lineHeight: rem(64),
  letterSpacing: 0,
};

export const productiveHeading07 = heading07;

export const expressiveHeading01 = {
  ...heading01,
  fontSize: rem(scale[1]),
  lineHeight: rem(20),
  letterSpacing: px(0.16),
};

export const expressiveHeading02 = {
  ...heading02,
  lineHeight: rem(24),
};

export const expressiveHeading03 = {
  fontSize: rem(scale[4]),
  fontWeight: fontWeights.regular,
  lineHeight: '130%',
  letterSpacing: 0,
  breakpoints: {
    xlg: {
      fontSize: rem(scale[4]),
      lineHeight: '125%',
    },
    max: {
      fontSize: rem(scale[5]),
    },
  },
};

export const expressiveHeading04 = {
  fontSize: rem(scale[6]),
  fontWeight: fontWeights.regular,
  lineHeight: '129%',
  letterSpacing: 0,
  breakpoints: {
    xlg: {
      fontSize: rem(scale[6]),
      lineHeight: '125%',
    },
    max: {
      fontSize: rem(scale[7]),
    },
  },
};

export const expressiveHeading05 = {
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.regular,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[8]),
      fontWeight: fontWeights.light,
      lineHeight: '122%',
    },
    lg: {
      fontSize: rem(scale[9]),
      lineHeight: '119%',
    },
    xlg: {
      fontSize: rem(scale[10]),
      lineHeight: '117%',
    },
    max: {
      fontSize: rem(scale[12]),
      lineHeight: rem(70),
    },
  },
};

export const expressiveHeading06 = {
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.semibold,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[8]),
      lineHeight: '122%',
    },
    lg: {
      fontSize: rem(scale[9]),
      lineHeight: '119%',
    },
    xlg: {
      fontSize: rem(scale[10]),
      lineHeight: '117%',
    },
    max: {
      fontSize: rem(scale[12]),
      lineHeight: rem(70),
    },
  },
};

export const expressiveParagraph01 = {
  fontSize: rem(scale[5]),
  fontWeight: fontWeights.light,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    lg: {
      fontSize: rem(scale[6]),
      lineHeight: '129%',
    },
    max: {
      fontSize: rem(scale[7]),
      lineHeight: '125%',
    },
  },
};

export const quotation01 = {
  fontSize: rem(scale[4]),
  fontWeight: fontWeights.regular,
  lineHeight: '130%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[4]),
    },
    lg: {
      fontSize: rem(scale[5]),
      lineHeight: '125%',
    },
    xlg: {
      fontSize: rem(scale[6]),
      lineHeight: '129%',
    },
    max: {
      fontSize: rem(scale[7]),
      lineHeight: '125%',
    },
  },
};

export const quotation02 = {
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.light,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[8]),
      lineHeight: '122%',
    },
    lg: {
      fontSize: rem(scale[9]),
      lineHeight: '119%',
    },
    xlg: {
      fontSize: rem(scale[10]),
      lineHeight: '117%',
    },
    max: {
      fontSize: rem(scale[12]),
    },
  },
};

export const display01 = {
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.light,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[9]),
    },
    lg: {
      fontSize: rem(scale[11]),
    },
    xlg: {
      fontSize: rem(scale[12]),
      lineHeight: '117%',
    },
    max: {
      fontSize: rem(scale[14]),
      lineHeight: '113%',
    },
  },
};

export const display02 = {
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.semibold,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[9]),
    },
    lg: {
      fontSize: rem(scale[11]),
    },
    xlg: {
      fontSize: rem(scale[12]),
      lineHeight: '116%',
    },
    max: {
      fontSize: rem(scale[14]),
      lineHeight: '113%',
    },
  },
};

export const display03 = {
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.light,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[13]),
      lineHeight: '115%',
    },
    lg: {
      fontSize: rem(scale[16]),
      lineHeight: '111%',
      letterSpacing: px(-0.64),
    },
    xlg: {
      fontSize: rem(scale[19]),
      lineHeight: '107%',
      letterSpacing: px(-0.64),
    },
    max: {
      fontSize: rem(scale[22]),
      lineHeight: '105%',
      letterSpacing: px(-0.96),
    },
  },
};

export const display04 = {
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.semibold,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[13]),
      lineHeight: '115%',
    },
    lg: {
      fontSize: rem(scale[16]),
      lineHeight: '111%',
      letterSpacing: px(-0.64),
    },
    xlg: {
      fontSize: rem(scale[19]),
      lineHeight: '107%',
      letterSpacing: px(-0.64),
    },
    max: {
      fontSize: rem(scale[22]),
      lineHeight: '105%',
      letterSpacing: px(-0.96),
    },
  },
};
