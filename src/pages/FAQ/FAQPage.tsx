import { List, AccordionListItem } from 'phantomartist';
import { BodySection } from '../../components/Layouts/BodySection';
import { PageHeading } from '../../components/Layouts/PageHeading.tsx';
import { questions } from './faqs.tsx';

const FAQPage = () => {
  return (
    <BodySection>
      <PageHeading
        title="FAQ"
        subtitle="That stands for Frequently Asked Questions"
      />
      <List>
        {questions.map((item, index) => (
          <AccordionListItem key={index} title={item.q}>
            {item.a}
          </AccordionListItem>
        ))}
      </List>
    </BodySection>
  );
};
export default FAQPage;
