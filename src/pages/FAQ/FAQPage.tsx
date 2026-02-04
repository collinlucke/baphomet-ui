import { Main, Accordion } from 'athameui';
import { PageHeading } from '../../components/Layouts/PageHeading.tsx';
import { faqs } from './faqs.tsx';

const FAQPage = () => {
  return (
    <Main>
      <PageHeading
        title="FAQ"
        subtitle="That stands for Frequently Asked Questions"
      />
      <Accordion items={faqs} />
    </Main>
  );
};
export default FAQPage;
