import { tokens } from 'athameui';

type ModalContentProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  testId?: string;
};

export const ModalContent = ({
  children,
  title,
  subtitle,
  testId
}: ModalContentProps) => {
  return (
    <div
      css={baphStyles.modalContent}
      role="dialog"
      data-testid={testId}
      aria-label={`${title} Modal Content`}
    >
      <div css={baphStyles.header}>
        <h2 css={baphStyles.title}>{title}</h2>
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
  title: {
    color: tokens.color.primary[500]
  },
  subtitle: {
    margin: 0,
    color: tokens.color.secondary[800]
  }
};
