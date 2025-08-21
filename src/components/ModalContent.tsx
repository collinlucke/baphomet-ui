type ModalContentProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  title,
  subtitle
}) => {
  return (
    <div
      css={baphStyles.modalContent}
      role="dialog"
      aria-label={`${title} Modal Content`}
    >
      <div css={baphStyles.header}>
        <h2>{title}</h2>
        {subtitle && (
          <p css={baphStyles.subtitle} role="doc-subtitle">
            {subtitle}
          </p>
        )}
      </div>
      <div role="region">{children}</div>
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
  subtitle: {
    margin: 0,
    color: '#6b7280'
  }
};
