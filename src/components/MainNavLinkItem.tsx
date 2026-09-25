import { Button } from 'athameui';
import { Link } from 'react-router-dom';
import { isSmallOrMobileVar } from '../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';

type MainNavLinkItemProps = {
  label: string;
  to: string;
  onClick?: () => void;
};

export const MainNavLinkItem = ({
  label,
  to,
  onClick
}: MainNavLinkItemProps) => {
  const isSmallOrMobile = useReactiveVar(isSmallOrMobileVar);

  return (
    <Link to={to}>
      <Button
        variant="ghost"
        size={isSmallOrMobile ? 'full' : 'small'}
        textPosition={isSmallOrMobile ? 'left' : 'center'}
        dark
        onClick={onClick}
      >
        {label}
      </Button>
    </Link>
  );
};
