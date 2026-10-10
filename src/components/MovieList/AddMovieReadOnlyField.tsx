import { FormLabel } from 'athameui';

export const AddMovieReadOnlyField = ({
  label,
  value
}: {
  label: string | number;
  value: string | number;
}) => {
  return (
    <div css={baphStyles.addMovieReadOnlyFieldContainer}>
      <FormLabel label={label} dark />
      <div css={baphStyles.addMovieReadOnlyFieldValue}>{value}</div>
    </div>
  );
};

const baphStyles = {
  addMovieReadOnlyFieldContainer: {
    width: '100%',
    marginTop: '1rem',
    lineHeight: '1.25'
  },
  addMovieReadOnlyFieldValue: {
    marginTop: '.2rem',
    color: 'var(--color-tertiary-600)'
  }
};
