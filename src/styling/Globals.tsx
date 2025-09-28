import { Global, css } from '@emotion/react';
import { baphScrollbarStyles } from './baphTheme';

export const AppGlobals = () => {
  return (
    <Global
      styles={css`
        .scrollable {
          scrollbar-width: thin;
          scrollbar-color: ${baphScrollbarStyles.sbThumbColor}
            ${baphScrollbarStyles.sbTrackColor};
          &::-webkit-scrollbar {
            width: ${baphScrollbarStyles.sbSize};
          }

          &::-webkit-scrollbar-track {
            background: ${baphScrollbarStyles.sbTrackColor};
            border-radius: 3px;
          }

          &::-webkit-scrollbar-thumb {
            background: ${baphScrollbarStyles.sbThumbColor};
            border-radius: 3px;
          }
        }
        @supports not selector(::-webkit-scrollbar) {
          .scrollable {
            scrollbar-color: ${baphScrollbarStyles.sbThumbColor}
              ${baphScrollbarStyles.sbTrackColor};
          }
        }
      `}
    />
  );
};
