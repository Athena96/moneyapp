import {Theme} from '@aws-amplify/ui-react';
import {moneyGreen} from './utilities/constants';

const theme: Theme = {
  name: 'cra-my-theme',

  tokens: {

    colors: {
      border: {

        primary: {
          value: moneyGreen,
        },
        secondary: {
          value: moneyGreen,
        },
      },
      font: {

        active: {
          value: moneyGreen,

        },

        primary: {
          value: moneyGreen,
        },
        secondary: {
          value: moneyGreen,
        },
      },
      // brand: {
      //   primary: {
      //     '10': moneyGreen,
      //     '80': moneyGreen,
      //     '90': moneyGreen,
      //     '100': moneyGreen
      //   },
      // },
    },
    components: {

      button: {
        // this will affect the font weight of all button variants
        fontWeight: {value: moneyGreen},
        // style the primary variation
        primary: {
          backgroundColor: {value: moneyGreen},
          _hover: {
            backgroundColor: {value: moneyGreen},
          },
        },
      },


      tabs: {
        item: {
          _focus: {
            color: {
              value: moneyGreen,
            },
          },
          _hover: {
            color: {
              value: 'grey',
            },
          },
          _active: {
            color: {
              value: moneyGreen,
            },
          },
          _inactive: {
            color: {
              value: moneyGreen,
            },
          },
          _disabled: {
            color: {
              value: moneyGreen,
            },
          },
        },
      },
    },
  },

};

export default theme;
