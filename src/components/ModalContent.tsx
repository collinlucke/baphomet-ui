type ModalContentProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  titleId?: string;
  subtitleId?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  title,
  subtitle,
  titleId,
  subtitleId,
  level = 2
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const generatedTitleId = titleId || `modal-title-${Date.now()}`;
  const generatedSubtitleId = subtitleId || `modal-subtitle-${Date.now()}`;

  return (
    <div
      css={baphStyles.modalContent}
      role="dialog"
      aria-labelledby={generatedTitleId}
      aria-describedby={subtitle ? generatedSubtitleId : undefined}
    >
      <div css={baphStyles.header}>
        <HeadingTag css={baphStyles.title} id={generatedTitleId}>
          {title}
        </HeadingTag>
        {subtitle && (
          <p
            css={baphStyles.subtitle}
            id={generatedSubtitleId}
            role="doc-subtitle"
          >
            {subtitle}
          </p>
        )}
      </div>
      <div role="region" aria-label="Modal content">
        {children}
      </div>
    </div>
  );
};

const baphStyles = {
  modalContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
    width: '100%'
  },
  header: {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  title: {},
  subtitle: {
    margin: 0,
    color: '#6b7280'
  }
};
