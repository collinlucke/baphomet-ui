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
    <div css={baphStyles.modalContent}>
      <div css={baphStyles.header}>
        <h2 css={baphStyles.title}>{title}</h2>
        {subtitle && <p css={baphStyles.subtitle}>{subtitle}</p>}
      </div>
      {children}
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
