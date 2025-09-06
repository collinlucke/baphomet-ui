import { List, AccordionListItem } from '@collinlucke/phantomartist';
import { BodySection } from '../../components/BodySection';
import { PageHeading } from '../../components/PageHeading';
import { questions } from './faqs.tsx';

export const FAQPage = () => {
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
