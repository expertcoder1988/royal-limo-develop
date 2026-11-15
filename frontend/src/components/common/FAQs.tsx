import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import car1flipped from "../../assets/car1flipped.webp";


const FAQs = ({
  content,
}: {
  content: {
    description: string;
    items: {
      question: string;
      hasBullets: boolean;
      hasLink: boolean;
      answer: {
        innerHTML?: string;
        plainText?: string;
        link?: string;
        linkText?: string;
        answerTextBeforeLink?: string;
        answerTextAfterLink?: string;
        bulletsIntroPhrase?: string;
        bullets?: {
          hasLink: boolean;
          plainText?: string;
          link?: string;
          linkText?: string;
          answerTextBeforeLink?: string;
          answerTextAfterLink?: string;
        }[];
      };
    }[];
  };
}) => {
  return (
    <div className="grid grid-cols-7 gap-12 max-md:flex flex-col">
      <div className="col-span-3 space-y-4">
        <h2 className="text-4xl font-semibold text-primary">FAQs</h2>
        <p className="text-primary-foreground w-3/4">
          Here are some basic questions and answers to help you get started.
        </p>
        <img 
          src={car1flipped.src}
          alt="FAQs"
          title="FAQs"
          className="w-full h-96 object-cover rounded-md shadow-md z-10"
        />
      </div>
      <div className="col-span-4">
        <Accordion
          color="primary"
          type="single"
          collapsible
          className="w-full"
          defaultValue={content.items[0].question}
        >
          {content.items.map((item, index) => {
            return (
              <AccordionItem value={item.question} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="pb-0">
                  {item.answer?.innerHTML ? (
                    <>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.answer.innerHTML,
                        }}
                      />
                    </>
                  ) : item.hasBullets ? (
                    <>
                      <p>{item.answer.bulletsIntroPhrase}</p>
                      <ol className="list-decimal list-inside">
                        {item.answer.bullets?.map((bullet, index) => {
                          if (bullet.hasLink) {
                            return (
                              <li key={index}>
                                {bullet.answerTextBeforeLink}{" "}
                                <a
                                  href={bullet.link}
                                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                                >
                                  {bullet.linkText}
                                </a>{" "}
                                {bullet.answerTextAfterLink}
                              </li>
                            );
                          } else {
                            return <li key={index}>{bullet.plainText}</li>;
                          }
                        })}
                      </ol>
                    </>
                  ) : item.hasLink ? (
                    <p>
                      {item.answer.answerTextBeforeLink}{" "}
                      <a
                        href={item.answer.link}
                        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      >
                        {item.answer.linkText}
                      </a>{" "}
                      {item.answer.answerTextAfterLink}
                    </p>
                  ) : (
                    <p>{item.answer.plainText}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQs;
