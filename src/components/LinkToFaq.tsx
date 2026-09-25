import { Link } from 'react-router-dom';
import { Button } from 'athameui';

export const LinkToFaq = () => {
  return (
    <Link to="/faq" className="faq-link" css={baphStyles.faqLink}>
      <Button variant="tertiary" dark>
        Interested in knowing more? Go FAQ yourself!
      </Button>
    </Link>
  );
};

const baphStyles = {
  faqLink: {
    alignSelf: 'center',
    marginTop: '25px'
  }
};
